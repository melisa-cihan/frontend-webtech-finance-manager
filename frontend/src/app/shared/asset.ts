export interface Asset {
    id: string;
    asset: string;
    category: string;
    current_value: string;
    purchase_price: number;
    roi: number;
    location: string;
    purchase_date: Date;
}
