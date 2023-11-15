import { MarcaCarro } from '../models/MarcaCarro';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

interface CarResponse {
  Makes?: Array<any>;
}

@Injectable({
  providedIn: 'root'
})
export class MarcaCarroService {

  private API_CARROS = 'https://www.carqueryapi.com/api/0.3/?callback=%3F&cmd=getMakes';

  constructor(
    private http: HttpClient,
  ) { }

  private mapMarcas(marcas:any): MarcaCarro[] {
    console.log(marcas)
    return marcas.map((marca: { make_id: any; make_display: any; }) => ({
      codigo: marca.make_id,
      nome: marca.make_display
    }));
  }

  public getMarcas(): Observable<MarcaCarro[]> {
    // jsonp pq é API externa para que o CORS não pare
    return this.http.jsonp(this.API_CARROS, 'callback').pipe(map((res: CarResponse) => this.mapMarcas(res.Makes)))
  }
}
