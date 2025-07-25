import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { forkJoin } from 'rxjs'; // For parallel API calls

// Import services and interfaces
import { GreenLeafCollectionService } from '../../../Services/green_leaf_collection.service';
import { SupplierService } from '../../../Services/supplier.service';
import { WeightDifferenceService } from '../../../Services/weight-difference.service'; // NEW: Import WeightDifferenceService
import { GreenLeafCollection } from '../../../models/green-leaf-collection.interface';
import { Supplier } from '../../../models/supplier.interface';
import { WeightDifference } from '../../../models/weight-difference.interface';


// Interfaces for Report-specific data structures
interface GlcSummaryKpi {
  totalCollectedKg: number;
  numberOfCollections: number;
  collectionsWithDiffPercent: number;
  totalWeightLossKg: number;
}

interface SupplierSummary {
  supplierId: number;
  totalKilosCollected: number;
  numberOfCollections: number;
  numberOfDifferences: number;
  differenceRate: number; // Percentage
}


@Component({
  selector: 'app-green-leaf-collection-report',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './green-leaf-collection-report.component.html',
  styleUrls: ['./green-leaf-collection-report.component.css']
})
export class GreenLeafCollectionReportComponent implements OnInit {
  // Raw data from backend
  allGreenLeafCollections: GreenLeafCollection[] = [];
  allWeightDifferences: WeightDifference[] = []; // Now populated from service
  suppliers: Supplier[] = []; // For supplier filter dropdown

  // Filtered data for display
  filteredCollectionRecords: GreenLeafCollection[] = [];
  filteredWeightDifferences: WeightDifference[] = [];
  supplierSummaries: SupplierSummary[] = []; // For supplier summary table

  // Filter properties
  selectedPeriod: string = 'last3Months';
  startDate: string = '';
  endDate: string = '';
  selectedSupplierId: number | null = null;
  displayPeriod: string = '';
  reportGeneratedDate: Date = new Date();

  // Summary KPIs
  summary: GlcSummaryKpi = {
    totalCollectedKg: 0,
    numberOfCollections: 0,
    collectionsWithDiffPercent: 0,
    totalWeightLossKg: 0
  };

  // Charts
  public monthlyCollectionChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  public monthlyCollectionChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false, scales: { x: {}, y: {} } };
  public monthlyCollectionChartType: ChartType = 'bar';

  public supplierVolumeChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  public supplierVolumeChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false, scales: { x: {}, y: {} } };
  public supplierVolumeChartType: ChartType = 'bar';

  public differenceRateChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  public differenceRateChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false, scales: { x: {}, y: {} } };
  public differenceRateChartType: ChartType = 'line';

  public teaTypeDistributionChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  public teaTypeDistributionChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } };
  public teaTypeDistributionChartType: ChartType = 'pie';

  public weightDifferenceBySupplierChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  public weightDifferenceBySupplierChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false, scales: { x: {}, y: {} } };
  public weightDifferenceBySupplierChartType: ChartType = 'bar';

  public isBrowser: boolean; // For SSR guard

  constructor(
    private router: Router,
    private glcService: GreenLeafCollectionService,
    private supplierService: SupplierService,
    private weightDifferenceService: WeightDifferenceService, // NEW: Inject WeightDifferenceService
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.reportGeneratedDate = new Date();
    this.setInitialPeriod();
    this.loadAllReportData(); // Load all necessary data
  }

  private setInitialPeriod(): void {
    const today = new Date();
    let calculatedStartDate: Date;
    let calculatedEndDate: Date;

    switch (this.selectedPeriod) {
      case 'currentMonth':
        calculatedStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        calculatedEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.displayPeriod = `${calculatedStartDate.toLocaleString('default', { month: 'long' })} ${calculatedStartDate.getFullYear()}`;
        break;
      case 'last3Months':
        calculatedEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        calculatedStartDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        this.displayPeriod = `${calculatedStartDate.toLocaleString('default', { month: 'long', year: 'numeric' })} - ${calculatedEndDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
        break;
      case 'currentQuarter':
        const currentMonth = today.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3);
        calculatedStartDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
        calculatedEndDate = new Date(today.getFullYear(), currentQuarter * 3 + 3, 0);
        this.displayPeriod = `Q${currentQuarter + 1} ${today.getFullYear()}`;
        break;
      case 'currentYear':
        calculatedStartDate = new Date(today.getFullYear(), 0, 1);
        calculatedEndDate = new Date(today.getFullYear(), 11, 31);
        this.displayPeriod = `${today.getFullYear()}`;
        break;
      case 'custom':
        calculatedStartDate = this.startDate ? new Date(this.startDate) : new Date(0);
        calculatedEndDate = this.endDate ? new Date(this.endDate) : new Date();
        this.displayPeriod = `${calculatedStartDate.toISOString().split('T')[0]} to ${calculatedEndDate.toISOString().split('T')[0]}`;
        break;
      default:
        calculatedStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        calculatedEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.displayPeriod = `${calculatedStartDate.toLocaleString('default', { month: 'long' })} ${calculatedStartDate.getFullYear()}`;
        break;
    }
    this.startDate = calculatedStartDate.toISOString().split('T')[0];
    this.endDate = calculatedEndDate.toISOString().split('T')[0];
  }

  loadAllReportData(): void {
    forkJoin([
      this.glcService.getGreenLeafCollections(),
      this.supplierService.getSuppliers(),
      this.weightDifferenceService.getWeightDifferences(this.startDate, this.endDate) // NEW: Fetch real weight differences
    ]).subscribe({
      next: ([collections, suppliers, weightDifferences]) => { // NEW: Destructure weightDifferences
        this.allGreenLeafCollections = collections.map(c => ({
          ...c,
          collectionDate: new Date(c.collectionDate).toISOString().split('T')[0]
        })).sort((a, b) => new Date(a.collectionDate).getTime() - new Date(b.collectionDate).getTime());

        this.suppliers = suppliers; // Populate suppliers for the filter dropdown

        // FIX: Populate allWeightDifferences from the service response
        this.allWeightDifferences = weightDifferences.map(wd => ({
          ...wd,
          differenceRecordedDate: new Date(wd.differenceRecordedDate).toISOString().split('T')[0]
        })).sort((a, b) => new Date(a.differenceRecordedDate).getTime() - new Date(b.differenceRecordedDate).getTime());


        console.log('All Green Leaf Collections:', this.allGreenLeafCollections);
        console.log('All Weight Differences (from service):', this.allWeightDifferences);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading all report data:', error);
        alert('Failed to load report data. Please check backend connections.');
      }
    });
  }

  applyFilters(): void {
    this.reportGeneratedDate = new Date();
    let tempCollections = [...this.allGreenLeafCollections];
    let tempWeightDifferences = [...this.allWeightDifferences];

    // Filter by Date Range
    const filterStartDate = new Date(this.startDate);
    const filterEndDate = new Date(this.endDate);
    filterEndDate.setDate(filterEndDate.getDate() + 1); // Include end date

    tempCollections = tempCollections.filter(record => {
      const recordDate = new Date(record.collectionDate);
      return recordDate >= filterStartDate && recordDate < filterEndDate;
    });

    tempWeightDifferences = tempWeightDifferences.filter(record => {
      const recordDate = new Date(record.differenceRecordedDate);
      return recordDate >= filterStartDate && recordDate < filterEndDate;
    });

    // Filter by Supplier ID
    if (this.selectedSupplierId !== null) {
      tempCollections = tempCollections.filter(record => record.supplierId === this.selectedSupplierId);
      tempWeightDifferences = tempWeightDifferences.filter(record => record.supplierId === this.selectedSupplierId);
    }

    this.filteredCollectionRecords = tempCollections;
    this.filteredWeightDifferences = tempWeightDifferences;

    this.calculateSummaryKpis();
    if (this.isBrowser) {
      this.updateChartData();
    }
    this.generateSupplierSummaries();
  }

  clearFilters(): void {
    this.selectedPeriod = 'last3Months'; // Reset to default
    this.setInitialPeriod(); // Recalculate dates for default period
    this.selectedSupplierId = null; // Clear supplier filter
    this.applyFilters();
  }

  calculateSummaryKpis(): void {
    this.summary.numberOfCollections = this.filteredCollectionRecords.length;
    this.summary.totalCollectedKg = this.filteredCollectionRecords.reduce((sum, record) =>
      sum + record.normalTeaLeafWeight + record.goldenTipTeaLeafWeight, 0);

    const collectionsWithDiff = this.filteredCollectionRecords.filter(record => record.hasDifference).length;
    this.summary.collectionsWithDiffPercent = this.summary.numberOfCollections > 0 ?
      parseFloat(((collectionsWithDiff / this.summary.numberOfCollections) * 100).toFixed(2)) : 0;

    this.summary.totalWeightLossKg = this.filteredWeightDifferences.reduce((sum, diff) =>
      sum + (diff.normalTeaLeafDifference < 0 ? Math.abs(diff.normalTeaLeafDifference) : 0) +
      (diff.goldenTipTeaLeafDifference < 0 ? Math.abs(diff.goldenTipTeaLeafDifference) : 0), 0);
  }

  private updateChartData(): void {
    // 1. Monthly Collection Trend (Stacked Bar Chart)
    const monthlyData: { [key: string]: { normal: number, golden: number } } = {};
    this.filteredCollectionRecords.forEach(record => {
      const month = new Date(record.collectionDate).toISOString().substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { normal: 0, golden: 0 };
      }
      monthlyData[month].normal += record.normalTeaLeafWeight;
      monthlyData[month].golden += record.goldenTipTeaLeafWeight;
    });
    const sortedMonths = Object.keys(monthlyData).sort();
    const normalWeights = sortedMonths.map(month => monthlyData[month].normal);
    const goldenWeights = sortedMonths.map(month => monthlyData[month].golden);

    this.monthlyCollectionChartData.labels = [...sortedMonths];
    this.monthlyCollectionChartData.datasets = [
      { data: normalWeights, label: 'Normal Tea (Kg)', backgroundColor: 'rgba(75,192,192,0.6)' },
      { data: goldenWeights, label: 'Golden Tip (Kg)', backgroundColor: 'rgba(255,159,64,0.6)' }
    ];
    this.monthlyCollectionChartOptions!.scales = { // FIX: Added ! to assert non-null
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    };


    // 2. Collections by Supplier (Top N) (Bar Chart)
    const supplierVolume: { [key: number]: number } = {};
    this.filteredCollectionRecords.forEach(record => {
      supplierVolume[record.supplierId] = (supplierVolume[record.supplierId] || 0) + record.normalTeaLeafWeight + record.goldenTipTeaLeafWeight;
    });
    const sortedSupplierIds = Object.keys(supplierVolume).map(Number).sort((a,b) => supplierVolume[b] - supplierVolume[a]); // Sort by volume descending
    const topNSup = sortedSupplierIds.slice(0, 10); // Top 10 suppliers
    const topNVolumes = topNSup.map(id => supplierVolume[id]);

    this.supplierVolumeChartData.labels = [...topNSup.map(id => `Supplier ${id}`)];
    this.supplierVolumeChartData.datasets = [{ data: topNVolumes, label: 'Total Collected (Kg)', backgroundColor: 'rgba(54, 162, 235, 0.6)' }];
    this.supplierVolumeChartOptions!.scales = { x: {}, y: { beginAtZero: true } }; // FIX: Added ! to assert non-null


    // 3. Difference Rate Trend (Line Chart)
    const monthlyDiffData: { [key: string]: { total: number, diff: number } } = {};
    this.filteredCollectionRecords.forEach(record => {
      const month = new Date(record.collectionDate).toISOString().substring(0, 7);
      if (!monthlyDiffData[month]) {
        monthlyDiffData[month] = { total: 0, diff: 0 };
      }
      monthlyDiffData[month].total++;
      if (record.hasDifference) {
        monthlyDiffData[month].diff++;
      }
    });
    const sortedDiffMonths = Object.keys(monthlyDiffData).sort();
    const diffRates = sortedDiffMonths.map(month =>
      monthlyDiffData[month].total > 0 ?
        parseFloat(((monthlyDiffData[month].diff / monthlyDiffData[month].total) * 100).toFixed(2)) : 0
    );

    this.differenceRateChartData.labels = [...sortedDiffMonths];
    this.differenceRateChartData.datasets = [{ data: diffRates, label: 'Difference Rate (%)', borderColor: 'rgba(255,99,132,1)', backgroundColor: 'rgba(255,99,132,0.2)', fill: true, tension: 0.3 }];
    this.differenceRateChartOptions!.scales = { x: {}, y: { beginAtZero: true, max: 100 } }; // FIX: Added ! to assert non-null


    // 4. Normal vs. Golden Tip Distribution (Pie Chart)
    const totalNormal = this.filteredCollectionRecords.reduce((sum, record) => sum + record.normalTeaLeafWeight, 0);
    const totalGolden = this.filteredCollectionRecords.reduce((sum, record) => sum + record.goldenTipTeaLeafWeight, 0);
    const totalTea = totalNormal + totalGolden;

    this.teaTypeDistributionChartData.labels = ['Normal Tea Leaf (Kg)', 'Golden Tip Tea Leaf (Kg)'];
    this.teaTypeDistributionChartData.datasets = [{
      data: [totalNormal, totalGolden],
      backgroundColor: ['#36A2EB', '#FFCE56'], // Blue for Normal, Yellow for Golden
      hoverBackgroundColor: ['#36A2EB', '#FFCE56']
    }];


    // 5. Weight Difference Breakdown by Supplier (Bar Chart)
    const supplierDiffData: { [key: number]: { normalDiff: number, goldenDiff: number } } = {};
    this.filteredWeightDifferences.forEach(diff => {
      if (!supplierDiffData[diff.supplierId]) {
        supplierDiffData[diff.supplierId] = { normalDiff: 0, goldenDiff: 0 };
      }
      supplierDiffData[diff.supplierId].normalDiff += diff.normalTeaLeafDifference;
      supplierDiffData[diff.supplierId].goldenDiff += diff.goldenTipTeaLeafDifference;
    });
    const sortedDiffSuppliers = Object.keys(supplierDiffData).map(Number).sort((a,b) => (supplierDiffData[b].normalDiff + supplierDiffData[b].goldenDiff) - (supplierDiffData[a].normalDiff + supplierDiffData[a].goldenDiff));
    const topNDiffSuppliers = sortedDiffSuppliers.slice(0, 10); // Top 10 suppliers
    const normalDiffAmounts = topNDiffSuppliers.map(id => supplierDiffData[id].normalDiff);
    const goldenDiffAmounts = topNDiffSuppliers.map(id => supplierDiffData[id].goldenDiff);

    this.weightDifferenceBySupplierChartData.labels = [...topNDiffSuppliers.map(id => `Supplier ${id}`)];
    this.weightDifferenceBySupplierChartData.datasets = [
      { data: normalDiffAmounts, label: 'Normal Tea Diff (Kg)', backgroundColor: 'rgba(255, 99, 132, 0.6)' },
      { data: goldenDiffAmounts, label: 'Golden Tip Diff (Kg)', backgroundColor: 'rgba(54, 162, 235, 0.6)' }
    ];
    this.weightDifferenceBySupplierChartOptions!.scales = { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }; // FIX: Added ! to assert non-null
  }

  private generateSupplierSummaries(): void {
    const supplierAggregates: { [key: number]: { totalKilos: number, numCollections: number, numDifferences: number } } = {};

    this.filteredCollectionRecords.forEach(record => {
      if (!supplierAggregates[record.supplierId]) {
        supplierAggregates[record.supplierId] = { totalKilos: 0, numCollections: 0, numDifferences: 0 };
      }
      supplierAggregates[record.supplierId].totalKilos += record.normalTeaLeafWeight + record.goldenTipTeaLeafWeight;
      supplierAggregates[record.supplierId].numCollections++;
      if (record.hasDifference) {
        supplierAggregates[record.supplierId].numDifferences++;
      }
    });

    const tempSupplierSummaries: SupplierSummary[] = [];
    Object.keys(supplierAggregates).map(Number).sort().forEach(supplierId => {
      const agg = supplierAggregates[supplierId];
      const differenceRate = agg.numCollections > 0 ?
        parseFloat(((agg.numDifferences / agg.numCollections) * 100).toFixed(2)) : 0;

      tempSupplierSummaries.push({
        supplierId: supplierId,
        totalKilosCollected: parseFloat(agg.totalKilos.toFixed(2)),
        numberOfCollections: agg.numCollections,
        numberOfDifferences: agg.numDifferences,
        differenceRate: differenceRate
      });
    });

    this.supplierSummaries = tempSupplierSummaries.sort((a,b) => b.totalKilosCollected - a.totalKilosCollected); // Sort summary table by kilos collected
  }


  exportReport(): void {
    alert('Export Report (CSV) functionality will be implemented here.');
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}
