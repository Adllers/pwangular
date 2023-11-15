import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import Dexie from 'dexie';
import { OnlineOfflineService } from './online-offline.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
}) //toda tabela vai ter id do tipo string
export abstract class BaseService<T extends {id: string}> {
  
  private db: Dexie | undefined;
  private table: Dexie.Table<T, any> | undefined;

  //acessíveis aqui e classes filhas
  protected http: HttpClient;
  protected onlineOfflineService: OnlineOfflineService;

  constructor(
    protected injector: Injector,
    @Inject('nomeTabela') protected nomeTabela: string,
    @Inject('urlApi') protected urlApi: string,
  ) {
    this.http = this.injector.get(HttpClient);
    this.onlineOfflineService = this.injector.get(OnlineOfflineService);

    this.ouvirStatusConexao();
    this.iniciarIndexedDb();
  }

  private iniciarIndexedDb() {
    this.db = new Dexie('db-seguros');
    this.db.version(1).stores({
      [this.nomeTabela]: 'id'
    });
    this.table = this.db.table(this.nomeTabela)
  }

  private salvarAPI(tabela: T) {
    this.http.post(this.urlApi, tabela)
      .subscribe(
        () => alert('tabela cadastrado com sucesso!'),
        (err) => console.log('Erro ao cadastrar tabela!')
      )
  }

  private async salvarIndexedDb(tabela: T){
    try {
      await this.table?.add(tabela);
      const todostabelas: T[] | undefined = await this.table?.toArray();
      console.log('tabela foi salvo no indexedDb', todostabelas);
    } catch (error){
      console.log('Erro ao incluir tabela no IndexedDb ', error);
    }
    
  }

  private async enviarIndexedDbParaApi() {
    console.log('enviar')
    const todostabelas: T[] | undefined = await this.table?.toArray();

    if (todostabelas) {
      for (const tabela of todostabelas) {
        this.salvarAPI(tabela);
        await this.table?.delete(tabela.id);
        console.log(`tabela com o id ${tabela.id} foi excluído com sucesso!`)
      }
    }
    
  }

  public salvar(tabela: T) {
    if (this.onlineOfflineService.isOnline) {
      this.salvarAPI(tabela);
    } else {
      this.salvarIndexedDb(tabela);
    }
  }

  listar(): Observable<T[]> {
    return this.http.get<T[]>(this.urlApi);
  }

  private ouvirStatusConexao() {
    this.onlineOfflineService.statusConexao
      .subscribe(online => {
      if (online) {
        this.enviarIndexedDbParaApi();
      } else {
        console.log('estou offline')
      }
    })
  }
}
