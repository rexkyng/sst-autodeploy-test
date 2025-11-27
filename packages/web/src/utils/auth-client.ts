import { Resource } from "sst";
import { createClient } from "@openauthjs/openauth/client";
import { subjects as openauthSubjects } from "@openauth/core/auth";

export const subjects = openauthSubjects;

export const client = createClient({
  clientID: "web",
  issuer: import.meta.env.VITE_AUTH_URL || Resource.MyApiGateway?.url,
});

