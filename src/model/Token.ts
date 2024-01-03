import { User } from './';

export interface AccessToken {
  exp: number;
  iss: string;
  iat: number;
  scopes: string[];
  type: OAuthGrant;
  user?: User;
}

export interface OAuthResponse {
  access_token: string;
  refresh_token: string;
  user_token?: string;
  expires: number;
}

export enum OAuthGrant {
  ClientCredentials = 'client_credentials',
  AuthorizationCode = 'authorization_code',
  UserLogin = 'user_login',
  RefreshToken = 'refresh_token',
}

export enum OAuthParam {
  Assertion = 'assertion',
  ClientId = 'client_id',
  ClientSecret = 'client_secret',
  Code = 'code',
  CodeVerifier = 'code_verifier',
  EntityId = 'entity_id',
  GrantType = 'grant_type',
  Scope = 'scope',
  RedirectUri = 'redirect_uri',
  RefreshToken = 'refresh_token',
  ResponseType = 'response_type',
  TokenFormat = 'token_format',
}
