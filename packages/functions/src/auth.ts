import { handle } from "hono/aws-lambda";
import { issuer } from "@openauthjs/openauth";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { CognitoProvider } from "@openauthjs/openauth/provider/cognito";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { DynamoStorage } from "@openauthjs/openauth/storage/dynamo";
import { createClient } from "@openauthjs/openauth/client";
import { Resource } from "sst";
import { subjects } from "@openauth/core/auth";
import { Select } from "@openauthjs/openauth/ui/select";

async function getUser(email: string) {
  return "123";
}

const awsRegion = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
const stage = process.env.SST_STAGE || "dev";
const cognitoDomain = `${stage}-auth`;

const authStorage = () => {
  if (stage !== "production") {
    return MemoryStorage();
  }
  return DynamoStorage({
    table: "openauth-sessions",
    pk: "pk",
    sk: "sk",
  });
}

const cognitoClientId = Resource.MyClient?.id || process.env.COGNITO_CLIENT_ID;
const cognitoClientSecret = Resource.MyClient?.secret || process.env.COGNITO_CLIENT_SECRET;

const app = issuer({
  select: Select({
    providers: {
      code: {
        display: "Code",
        hide: true,
      },
      password: {
        display: "2FA",
        hide: false,
      },
      cognito: {
        display: "Cognito",
        hide: false,
      },
    },
  }),
  subjects,
  storage: authStorage(),
  allow: async () => true,
  providers: {
    code: CodeProvider(
      CodeUI({
        sendCode: async (email, code) => {
          sendCode(email.email, code);
        },
      }),
    ),
    password: PasswordProvider(
      PasswordUI({
        sendCode: async (email, code) => {
          sendCode(email, code);
        },
        validatePassword: () => undefined,
      }),
    ),
    ...(cognitoClientId && cognitoClientSecret
      ? {
          cognito: CognitoProvider({
            domain: cognitoDomain,
            region: awsRegion,
            clientID: cognitoClientId,
            clientSecret: cognitoClientSecret,
            scopes: ["openid", "email", "profile"],
          }),
        }
      : {}),
  },
  success: async (ctx, value) => {
    if (!value) {
      throw new Error("Invalid provider value");
    }

    const getEmail = (): string => {
      if (value.provider === "code") return value.claims.email;
      if (value.provider === "password") return value.email;
      if (value.provider === "cognito") {
        return (value as any).claims?.email || (value as any).claims?.sub || "unknown";
      }
      throw new Error("Invalid provider");
    };

    return ctx.subject("user", {
      id: await getUser(getEmail()),
    });
  },
});

export const handler = handle(app);

let authorizerClient: ReturnType<typeof createClient> | null = null;

function getAuthorizerClient() {
	if (!authorizerClient) {
		const issuerUrl = Resource.MyApiGateway?.url;
		if (!issuerUrl) {
			throw new Error("MyAuth resource URL not available");
		}
		authorizerClient = createClient({
			clientID: "openauth",
			issuer: issuerUrl,
		});
	}
	return authorizerClient;
}

function sendCode(email: string, code: string) {
  console.log(email, code);
}

export const authorizerHandler = async (event: any) => {
	try {
		const authHeader = event.headers?.authorization || event.headers?.Authorization;
		
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return {
				isAuthorized: true,
				context: {
					userId: "",
					authenticated: "false",
				},
			};
		}

		const token = authHeader.split(" ")[1];
		const client = getAuthorizerClient();
		const verified = await client.verify(subjects, token);

		if (verified.err) {
			console.error("[AUTHORIZER] Token verification failed:", verified.err);
			return {
				isAuthorized: false,
				context: {},
			};
		}

		const userId = verified.subject.properties.id;
		console.log("[AUTHORIZER] Token verified - userId:", userId);

		return {
			isAuthorized: true,
			context: {
				userId,
				authenticated: "true",
			},
		};
	} catch (error) {
		console.error("[AUTHORIZER] Error:", error);
		return {
			isAuthorized: false,
			context: {},
		};
	}
};
