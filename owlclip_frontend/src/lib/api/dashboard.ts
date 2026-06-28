import { apiClient } from './client';



export async function getBillingHistory(){
  return apiClient(`/v1/dashboard/billing-history`);
}