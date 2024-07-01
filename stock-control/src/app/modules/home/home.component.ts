import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { AuthRequest } from './../../models/interfaces/user/auth/AuthRequest';
import { UserService } from './../../services/user/user.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  loginCard =true;

  // Campos obrigatórios.
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: [ '', Validators.required],

  })
  //Precisa importar o ReactiveFormsModule para trabalhar com formulários reativos
  // Injetando o UserService
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    // Serve para salvar dentro do cookie o token JWT do usuário
    private CookieService: CookieService,
    private MessageService: MessageService,
    private router: Router
  ){}

  onSubmitLoginForm(): void {
    if(this.loginForm.value && this.loginForm.valid){
      this.userService
      //AuthRequest é o tipo. A inteface que foi criada. Armazenar em cookie é melhor para a segurança.
      .authUser(this.loginForm.value as AuthRequest)
      .subscribe({
        next: (response) => {
          if(response){
            //  A ? no response é para validar se realmente existe o valor
            this.CookieService.set('USER_INFO', response?.token);
            this.loginForm.reset();
            this.router.navigate(['/dashboard']);

            this.MessageService.add({
              //Mensagem de sucesso usando o ToastModule do primeNg
              severity: 'success',
              summary: 'Sucesso',
              detail: `Bem vindo(a) de volta ${response.name}!`,
              life: 2000,
            })
          }
        },
        error: (err) =>{
              //Mensagem de erro usando o ToastModule do primeNg
          this.MessageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao fazer login`,
            life: 2000,
          });
          console.log(err);
        }
      })
    }
  }

  onSubmitsignupForm(): void {
    // Fazendo uma validação antes de chamar o serviço
    if (this.signupForm.value && this.signupForm.valid){
      // Chamando o serviço
      this.userService
      .signupUser(this.signupForm.value as SignupUserRequest)
        // Fazendo a inscrição no observable
      .subscribe({
        next: (response) => {
            if(response){
              this.signupForm.reset();
              this.loginCard = true;
              this.MessageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Usuário criado com sucesso@`,
                life: 2000,
              });
            }
        },
          error: (err) => {
            this.MessageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao criar usuário!`,
              life: 2000,
            });
            console.log(err)},
      })
    }
  }
}
