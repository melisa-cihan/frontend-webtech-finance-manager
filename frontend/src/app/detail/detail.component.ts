import { Component, OnInit, inject } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { Asset} from '../shared/asset';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
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
    assetControl: new FormControl<string>(''),
    categoryControl: new FormControl<string>(''),
    currentValueControl: new FormControl<number | null>(null),
    purchasePriceControl: new FormControl<number | null>(null),
    roiControl: new FormControl<number | null>(null),
    locationControl: new FormControl<string>(''),
    purchaseDateControl: new FormControl<Date | null>(null)
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
  }
  
  cancel(): void {
    this.router.navigate(['/assets']);
  }

}
