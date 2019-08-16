export interface Invoice{
  id: number;
  actual_amount: number;
  adjustments: number;
  booked_amount: number;
  campaign_id: number;
  campaign_name: string;
  line_item_name: string
}
