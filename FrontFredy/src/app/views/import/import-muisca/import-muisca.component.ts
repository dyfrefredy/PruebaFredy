import { Component, OnInit, ViewChild } from "@angular/core";
import { FileUpload } from "primeng/fileupload";
import { environment } from "../../../../environments/environment";
import { ConstantService } from '../../../constant/constant-service';
import { TransactionService } from "../../../services/transaction.service";

@Component({
  selector: "app-import-muisca",
  templateUrl: "./import-muisca.component.html",
  styleUrls: ["./import-muisca.component.css"],
})
export class ImportMuiscaComponent implements OnInit {
  @ViewChild(FileUpload) fileUploader: FileUpload;

  constructor(private transactionService: TransactionService, private constantService: ConstantService) {}

  ngOnInit(): void {}

  uploader(event) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let str = e.target.result;
    str = str.split("base64,")[1];
    this.transactionService
      .save(environment.adminAPI,this.constantService.IMPORT_MUISCA_URL, {
        file: str,
      })
      .subscribe((rst) => {
        console.log(rst);
        this.fileUploader.clear();
      });
  }
}
