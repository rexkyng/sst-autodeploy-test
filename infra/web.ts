import { apigateway } from "./apigateway";
import { auth } from "./auth";

export const web = new sst.aws.TanStackStart("MyWeb", {
  path: "packages/web",
  link: [auth],
  environment: {
    VITE_API_URL: $interpolate`${apigateway.url}/api/`,
    VITE_AUTH_URL: $interpolate`${apigateway.url}`,
  },
});
