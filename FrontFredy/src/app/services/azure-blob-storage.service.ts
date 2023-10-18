import { Injectable } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import {SAS} from  '../../environments/environment';
// import { UploadParams, UploadConfig } from './definitions';

@Injectable({
  providedIn: 'root'
})
export class AzureBlobStorageService {

  // Enter your storage account name
  accountName = SAS.accountName;
  // container name
  // containerName = "cbpin";


// Metodos que se deben de llamar a los componentes
  public uploadData(sas: string, containerName:string, content: Blob, name: string, handler: (status: number) => void) {
    this.uploadBlob(content, name, this.containerClient(sas, containerName), handler);
  }
// Metodos que se deben de llamar a los componentes
  public listData(sas: string, containerName: string): Promise<string[]> {
    return this.listBlobs(this.containerClient(sas, containerName))
  }
// Metodos que se deben de llamar a los componentes
  public downloadData(sas: string, containerName: string, name: string, handler: (blob: Blob) => void) {
    this.downloadBlob(name, this.containerClient(sas, containerName), handler)
  }
// Metodos que se deben de llamar a los componentes
  public deleteData(sas: string, containerName: string, name: string, handler: () => void) {
    this.deleteBlob(name, this.containerClient(sas, containerName), handler)
  }

  public existBlob(sas: string, containerName: string, name: string,): Promise<boolean> {
    return this.existBlobs(name, this.containerClient(sas, containerName))
  }

  // -Metodos encapsulados

  private uploadBlob(content: Blob, name: string, client: ContainerClient, handler: (status : number) => void) {
    let blockBlobClient = client.getBlockBlobClient(name);
    blockBlobClient.uploadData(content, { blobHTTPHeaders: { blobContentType: content.type } })
      .then(resp => handler(resp._response.status))
  }

  private async listBlobs(client: ContainerClient): Promise<string[]> {
    let result: string[] = []

    let blobs = client.listBlobsFlat();
    for await (const blob of blobs) {
      result.push(blob.name)
    }

    return result;
  }

  private async existBlobs(name: string, client: ContainerClient): Promise<boolean> {
    let blockBlobClient = client.getBlockBlobClient(name);

    return blockBlobClient.exists();
  }

  private downloadBlob(name: string, client: ContainerClient, handler: (blob: Blob) => void) {
    const blobClient = client.getBlobClient(name);
    blobClient.download().then(resp => {
      resp.blobBody.then(blob => {
        handler(blob)
      })
    })
  }

  private deleteBlob(name: string, client: ContainerClient, handler: () => void) {
    client.deleteBlob(name).then(() => {
      handler()
    })
  }

  private containerClient(sas: string, containerName: string): ContainerClient {
    return new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net?${sas}`)
            .getContainerClient(containerName);
  }

}
