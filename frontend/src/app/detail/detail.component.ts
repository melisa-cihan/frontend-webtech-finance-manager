import { Component, OnInit, inject } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { Asset} from '../shared/asset';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit{

  private bs = inject(BackendService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  
  asset!: Asset;
  id: string | null = ''
  form = new FormGroup({
    assetControl: new FormControl<string>('', [Validators.required]),
    categoryControl: new FormControl<string>('', [Validators.required]),
    currentValueControl: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    purchasePriceControl: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    roiControl: new FormControl<number | null>(null, [Validators.required]),
    locationControl: new FormControl<string>('', [Validators.required]),
    purchaseDateControl: new FormControl<Date | null>(null, [Validators.required])
});

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('id = ', this.id)
    
    this.bs.getOneAsset(this.id!).subscribe({
      next: (response: Asset) => {
        this.asset = response;
        this.form.patchValue({
          assetControl: this.asset?.asset,
          categoryControl: this.asset?.category,
          currentValueControl: this.asset?.current_value,
          purchasePriceControl: this.asset?.purchase_price,
          roiControl: this.asset?.roi,
          locationControl: this.asset?.location,
          purchaseDateControl: this.asset?.purchase_date 
        });
        console.log('asset in DetailComponent:', this.asset);
      },
      error: (err) => {
        console.error('Error fetching asset:', err);
      }
    });
  }
  
  update(): void {
    
    if (this.form.valid) {
    const values = this.form.value;
    this.asset.asset = values.assetControl!;
    this.asset.category = values.categoryControl!;
    this.asset.current_value = values.currentValueControl!;
    this.asset.purchase_price = values.purchasePriceControl!;
    this.asset.roi = values.roiControl!;
    this.asset.location = values.locationControl!;
    this.asset.purchase_date = values.purchaseDateControl!;

     
    this.bs.updateOneAsset(this.id!, this.asset).subscribe({
    next: (updatedAsset) => {
      console.log('Asset updated successfully', updatedAsset);
      this.router.navigate(['/assets']);
    },
    error: (err) => {
      console.error('Error updating asset:', err);
    }
    });

   } else {
    console.warn('Form is invalid. Please check the fields.');
    }
  }
  
  cancel(): void {
    this.router.navigate(['/assets']);
  }

}
