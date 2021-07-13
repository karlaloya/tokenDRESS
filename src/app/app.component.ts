import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Web3Service } from './services/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  cuenta = '';
  title = 'K Dresses';
  estado = 'No Conectado';
  count = 0;
  resultado = '';
  blockHash = '';
  blockNumber = '';
  from = '';
  to = '';
  transactionHash = '';

  elementos: any = [];
  cabeceras = ['Enviado por', 'Enviado a', 'Cantidad','Transaction Hash', 'Block Number'];

  constructor(public web3s: Web3Service){
  }

  ngAfterViewInit(): void {
    this.web3s.connectAccount().then((r)=>{ 
                                    this.estado = "Conectado";
                                    this.subscribeToEvents();
                                  });
  }

  limpiar(): void {
    this.cuenta = "";
    this.resultado = "";
    this.blockNumber = "";
    this.transactionHash = "";
    this.from = "";
  }

  balanceOf(): void {
    this.web3s.contrato.methods.balanceOf(this.web3s.accounts[0]).call().then((response: any) => {
                                this.count = response;
                                                       });
  }

  transfer(): void {
    this.web3s.contrato.methods.transfer(this.cuenta,1).send({from: this.web3s.accounts[0]})
                                           .then((response:any) => {
                                              this.resultado = "Envío realizado!";
                                              this.blockHash = response.blockHash;
                                              this.blockNumber = response.blockNumber;
                                              this.from = response.from;
                                              this.transactionHash = response.transactionHash;
                                           })
                                           .catch((error: any) => {
                                              console.log(error);
                                              this.resultado = "Error al enviar!";
                                           });
  }

  subscribeToEvents() {
    // Subscribe to pending transactions
    const self = this;
    this.web3s.contrato.events.Transfer({
                                              fromBlock: 0
                                            },
                                            (error: any, event: any) => {
                                              if (!error){                                                        
                                                this.elementos.push(
                                                  { blockHash: event.blockHash,
                                                    blockNumber:event.blockNumber,
                                                    transactionHash: event.transactionHash,                                 
                                                    from: event.returnValues.from,
                                                    to: event.returnValues.to,
                                                    cant: event.returnValues.tokens
                                                  }
                                                );                                                
                                              }                                              
                                            });

  }
}
