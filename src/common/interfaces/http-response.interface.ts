export interface HttpResponse {
  get<T>(url: string): Promise<T>;
}
