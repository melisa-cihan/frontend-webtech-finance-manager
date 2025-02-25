import { Component, inject, OnInit } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { Asset } from '../shared/asset';
import { FormControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit{
  asset!: Asset[];
  search = new FormControl();

  constructor(private bs: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.readAll();
  }

  readAll(): void {
    this.bs.getAllAssets().subscribe(
      {
        next: (response) => {
              this.asset = response;
              console.log(this.asset);
              return this.asset;
            },
        error: (err) => console.log(err),
        complete: () => console.log('getAll() completed')
      })
}
  delete(id: string): void {
    console.log('id', id)
    this.bs.deleteOneAsset(id).subscribe(
        {
          next: (response) => {
                console.log(response);
                this.readAll();
              },
          error: (err) => console.log(err),
          complete: () => console.log('deleting completed')
        })
  }

}
