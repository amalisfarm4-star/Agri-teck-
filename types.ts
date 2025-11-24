export enum UserRole {
  FARMER = 'FARMER',
  ACCOUNTANT = 'ACCOUNTANT',
  TECHNICIAN = 'TECHNICIAN'
}

export enum Language {
  IT = 'it',
  EN = 'en',
  ES = 'es'
}

// ... existing types ...
export interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  forecast: string;
  precipProb: number;
  et0: number;
}

export interface SensorReading {
  id: string;
  type: 'moisture' | 'temp' | 'ph';
  value: number;
  timestamp: string;
  zoneId: string;
}

export interface Invoice {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  items: string[];
  status: 'pending' | 'approved' | 'paid';
}

export interface AIAnalysisResult {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
}

export type MarketplaceCategory = 'machinery' | 'produce' | 'inputs' | 'services';

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  unit: string;
  category: MarketplaceCategory;
  description: string;
  image: string;
  location: string;
  seller: string;
  isOrganic?: boolean;
  certifications?: string[];
  rating?: number;
}

export interface CartItem extends MarketplaceItem {
  quantity: number;
}

export interface AIGeneratedListing {
  title: string;
  description: string;
  category: MarketplaceCategory;
  suggestedPrice: number;
  tags: string[];
}

export interface IrrigationZone {
  id: string;
  name: string;
  cropType: string;
  soilType: string;
  status: 'idle' | 'watering' | 'error' | 'offline';
  currentMoisture: number;
  targetMoisture: number;
  batteryLevel: number;
  aiMode: boolean;
}

export interface IrrigationProgram {
  id: string;
  zoneId: string;
  name: string;
  startTime: string;
  duration: number;
  days: number[];
  enabled: boolean;
  smartAdjusted?: boolean;
}

export interface IrrigationLog {
  id: string;
  zoneName: string;
  date: string;
  duration: number;
  volume: number;
  trigger: 'Manual' | 'Schedule' | 'AI';
}

export interface TwinSensor {
  id: string;
  type: 'moisture' | 'temp' | 'camera';
  position: [number, number, number];
  value: number;
  status: 'optimal' | 'warning' | 'critical';
}

export interface SimulationResult {
  timestamp: string;
  overallHealth: number;
  riskFactor: number;
  predictedMoisture: number;
  advice: string;
}

export type TwinViewMode = 'real' | 'moisture' | 'health' | 'disease_risk';

export interface FarmScore {
  agronomic: number;
  economic: number;
  sustainability: number;
  risk: number;
}

export interface DashboardKPI {
  label: string;
  value: string | number;
  unit?: string;
  trend: number;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'optimization';
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FinancialMetric {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface CropPerformance {
  crop: string;
  yield: number;
  revenuePerHa: number;
  costPerHa: number;
}

// New Types for Modules G & H
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
}

export interface Grant {
  id: string;
  title: string;
  deadline: string;
  amount: number;
  matchScore: number;
  region: string;
}

export interface BusinessPlanData {
  farmName: string;
  crop: string;
  investmentAmount: number;
  goal: string;
}
