import { Injectable, Injector } from '@angular/core';
import { Seguro } from '../models/Seguro';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SeguroService extends BaseService<any>{

  constructor(
    protected override injector: Injector,
  ) {
    super(injector, 'seguros', 'https:localhost:9000/api/seguros');
  }

  
}
