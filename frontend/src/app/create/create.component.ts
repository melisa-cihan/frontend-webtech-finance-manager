import { Component, TemplateRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from '../shared/backend.service';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgbDatepickerModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  private bs = inject(BackendService);
  private router = inject(Router);
  closeResult = '';
  private modalService: NgbModal = inject(NgbModal);

  
  assetFC = new FormControl('', [Validators.required]);
  categoryFC = new FormControl('', [Validators.required]);
  currentValueFC = new FormControl(null, [Validators.required, Validators.min(0)]);
  purchasePriceFC = new FormControl(null, [Validators.required, Validators.min(0)]);
  roiFC = new FormControl(null, [Validators.required]);
  locationFC = new FormControl('', [Validators.required]);
  purchaseDateFC = new FormControl(new Date, [Validators.required]);

  public formValid() {
    return this.assetFC.valid && this.categoryFC.valid && this.currentValueFC.valid && this.purchasePriceFC.valid && this.roiFC.valid && this.locationFC.valid && this.purchaseDateFC.valid;
  }

  register(content: TemplateRef<any>) {

    if(this.formValid())
    {
      let asset = {
        id: '',
        asset: this.assetFC.value!,
        category: this.categoryFC.value!,
        current_value: this.currentValueFC.value!,
        purchase_price: this.purchasePriceFC.value!,
        roi: this.roiFC.value!,
        location: this.locationFC.value!,
        purchase_date: this.purchaseDateFC.value!

      }

      this.bs.createNewAsset(asset).subscribe({
          next: (response) => console.log('response', response),
          error: (err) => console.log(err),
          complete: () => console.log('register completed')
      });

      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
      .then(
        (result: any) => {
          this.closeResult = `Closed with: ${result}`;
          this.router.navigate(['/assets']);
        },
        (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );

      console.log('new asset: ', asset)
    }
    else
    {
      console.warn('form still invalid!')
    }
  }

  cancel() {
  
    this.assetFC.reset();
    this.categoryFC.reset();
    this.currentValueFC.reset();
    this.purchasePriceFC.reset();
    this.roiFC.reset();
    this.locationFC.reset();
    this.purchaseDateFC.reset();

  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }



}
