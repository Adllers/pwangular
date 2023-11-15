import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnlineOfflineService {

  //Subject é um observable que podemos se inscrever mas ele também emite eventos
  private statusConexao$ = new Subject<boolean>();

  constructor() { 
    window.addEventListener('online', () => this.atualizaStatusConexao());
    window.addEventListener('offline', () => this.atualizaStatusConexao());
  }
  // podemos acessar a função como uma variável
  get isOnline():boolean  {
    return !!window.navigator.onLine;
  }

  get statusConexao(): Observable<boolean> {
    return this.statusConexao$.asObservable();
  }

  atualizaStatusConexao() {
    //O next vai emitir o status online
    this.statusConexao$.next(this.isOnline);
  }
}
