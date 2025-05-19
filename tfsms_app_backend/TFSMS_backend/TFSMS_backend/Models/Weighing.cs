namespace TFSMS_app_backend.Models;

public class Weighing
{
    public int Id { get; set; } 
    public string SupplierName { get; set; } = string.Empty;
    public string SupplierId { get; set; } = string.Empty;
    public double GrossWeight { get; set; }
    public double Deductions { get; set; }
    public double NetWeight { get; set; }
    public int SackCount { get; set; }
    public string? ContainerId { get; set; } = string.Empty;
    public bool IsConfirmed { get; internal set; }
}
