import { Endpoints } from 'constants/endpoints';
import type { User } from 'types/profile';
import type { HttpResponse } from 'types/shared';
import HttpClient from 'utils/HttpClient';

// Sign in with email and password
interface SignInParams {
  username: string;
  password: string;
  client_id: string;
  grant_type: string;
}
interface SignInResponse {
  userId?: number | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  roleId?: string | null;
}
export const signIn = async (params: SignInParams) => {
  return HttpClient.post<typeof params, SignInResponse>(
    Endpoints.auth.login,
    params
  );
};

// export const apiLogin = async (params: SignInParams) => {
//   mock.onPost(Endpoints.auth.login).reply(200, {
//     accessToken:
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMSIsInVuaXF1ZV9uYW1lIjoiMTEiLCJyb2xlTGlzdCI6Im92ZXJ2aWV3LGFuYWx5dGljcyxmaW5hbmNlLGxvZ2lzdGljcyxhY2NvdW50LXRlbmFudCxjb25maWd1cmF0aW9ucyxvcmdhbmlzYXRpb24sZW1wbG95ZWVzLGNvbXBhbnksc2VjdXJpdHkscm9sZXMtZXJtaXNzaW9ucyxhdXRoZW50aWNhdGlvbixsb2dzLG5vdGlmaWNhdGlvbnMsYWNjb3VudC10ZW5hbnQsYWNjb3VudCxjaGFuZ2UtcGFzc3dvcmQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJuaGFudEBnbWFpbC5jb20iLCJuYW1lIjoiTmjDoyBKaWthIGFoaWhpIEpvY2t5IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTG9jYXRpb24gQWRtaW5pc3RyYXRvciIsIlBlcm1pc3Npb25zIjoiW1widmVoaWNsZS5kZWxldGVcIixcInZlaGljbGUudXBkYXRlXCIsXCJ2ZWhpY2xlLmNyZWF0ZVwiLFwidmVoaWNsZS5yZWFkXCIsXCJsb2FkLmRlbGV0ZVwiLFwibG9hZC51cGRhdGVcIixcImxvYWQuY3JlYXRlXCIsXCJsb2FkLnJlYWRcIixcInRlbmRlci5iaWRcIixcInRlbmRlci5jb25maXJtYXRpb25cIixcImNvbnRhY3QucmVhZFwiLFwidGVuZGVyLnNlbGVjdE9mZmVyXCIsXCJ0ZW5kZXIudXBkYXRlXCIsXCJ0ZW5kZXIuY3JlYXRlXCIsXCJ0ZW5kZXIucmVhZFwiLFwiZG9jdW1lbnQucmVhZFwiLFwidGVuZGVyLndpdGhkcmF3XCIsXCJjb250YWN0LmNyZWF0ZVwiLFwiY29tcGFueS5yZWFkXCIsXCJjb250YWN0LnVwZGF0ZVwiLFwiZW1wbG95ZWUuZGVsZXRlXCIsXCJlbXBsb3llZS5jcmVhdGVcIixcImVtcGxveWVlLnJlYWRcIixcImxvY2F0aW9uLnVwZGF0ZVwiLFwibG9jYXRpb24ucmVhZFwiLFwiYWRkcmVzcy51cGRhdGVcIixcImFkZHJlc3MuY3JlYXRlXCIsXCJhZGRyZXNzLnJlYWRcIixcImVtcGxveWVlLnVwZGF0ZVwiLFwidGVybS5yZWFkXCIsXCJwZXJzb25hbFByb2ZpbGUudXBkYXRlXCIsXCJwZXJzb25hbFByb2ZpbGUucmVhZFwiXSIsIkNvbXBhbnlJZCI6IjUiLCJqdGkiOiJlM2MxNzEwMi1jYTM0LTQ1MzctYTk1Yi1mNmU0ZWZiMjEwMmMiLCJpYXQiOjE2NDczMzk1MTYsIm5iZiI6MTY0NzMzOTUxNiwiZXhwIjoxNjQ3NDI1OTE2fQ.rkhdggephqk37Nzqaus3EW4agZwGGLPtIlPNXkIe204',
//     refreshToken:
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMSIsInVuaXF1ZV9uYW1lIjoiMTEiLCJqdGkiOiIyYjI3Y2U4Mi0xYTY4LTQwMTEtODU2Mi1kYTM1MjZmNzEzZmQiLCJpYXQiOjE2NDczMzk1MTYsIm5iZiI6MTY0NzMzOTUxNiwiZXhwIjoxNjQ3OTg3NTE2fQ.o7Yfi6tW5Oboe6nk0Pn8Y8Sjn1V8TKHOtY-_BcSpuWA',
//     userId: '123',
//     roleId: 'account-tenant1',
//   });
//   return HttpClient.post<typeof params, SignInResponse>(
//     Endpoints.auth.login,
//     params
//   );
// };

// Sign out
export const signOut = async () => {
  return HttpClient.post(Endpoints.auth.logout);
};

// Get user profile
export const getUser = async () => {
  return HttpClient.get<HttpResponse<User>>(Endpoints.user.profile);
};

// export const getUserDetails = async () => {
//   mock.onGet(Endpoints.user.profile).reply(200, {
//     data: {
//       id: '123',
//       username: 'Hin',
//       avatar: '',
//       email: 'hieuvtd00195@gmail.com',
//       name: 'Hin',
//       //   key: [],
//     },
//   });

//   return HttpClient.get<HttpResponse<User>>(Endpoints.user.profile);
// };
