import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { environment } from 'src/environments/environments';



@Injectable({
  // Esse serviço pode ser injetado em qualquer classe
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL;

    // É quem permite fazer requisições http = HttpClientModule
  constructor(private http: HttpClient, private cookie: CookieService) {}

    //Serviço de criação de usuário
    //Quando fazemos uma requisição http, ele retorna um observable
    signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse> {
      return this.http.post<SignupUserResponse>(
        `${this.API_URL}/user`,
         requestDatas
      );
    }

    // Metodo para autenticar usuário
    // requestDatas pq espera dados de entrada
    authUser(requestDatas: AuthRequest): Observable<AuthResponse> {
      return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas);
    }

    //Metodo para validar se o usuário está logado
    isLoggedIn(): boolean{
      // Verificar se o usuário possui um token ou cookie
      const JWT_TOKEN = this.cookie.get('USER_INFO');
      return JWT_TOKEN ? true : false;
    }
  }
