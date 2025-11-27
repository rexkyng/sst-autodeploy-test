// Create Cognito User Pool
import { apigateway } from "./apigateway";

export const userPool = new sst.aws.CognitoUserPool("MyUserPool", {
	usernames: ["email"],
});

const apiUrl = $interpolate`${apigateway.url}`

// Create Cognito User Pool Client with secret for OAuth
export const cognitoClient = userPool.addClient("MyClient", {
	transform: {
		client: (args) => {
			args.generateSecret = true;
			// Use $interpolate to handle Output<T> type, then convert to array
			args.callbackUrls = apiUrl.apply(url => [url + "/cognito/callback"]);
			args.logoutUrls = apiUrl.apply(url => [url]);
		},
	},
});

// Create Cognito User Pool Domain
export const domain = new aws.cognito.UserPoolDomain("main", {
	userPoolId: userPool.id,
	domain: `${$app.stage}-auth`,
});
