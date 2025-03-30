import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { interval, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface Sensor {
  name: string;
  id: string;
  type: string;
  value: string;
}

interface Potentiometer {
  value: number;
  label: string;
}

interface SensorData {
  sensor: string;
  valor: string;
  unidad: string;
  createdAt: string;
}

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private API_BASE_URL = 'http://69.48.206.136:3000';
  @ViewChild('inventoryChart') chartCanvas!: ElementRef;
  inventoryChart!: Chart;
  config: any = { ultrasonico: '60', buzzer: '0' };
  sensorData: SensorData[] = [];
  history: SensorData[] = [];
  currentDistance: number = 0;
  isCollapsed = true;

  sensors: Sensor[] = [
    { name: 'LED Verde', id: 'ledVerde', type: 'led', value: '0' },
    { name: 'LED Amarillo', id: 'ledAmarillo', type: 'led', value: '0' },
    { name: 'LED Rojo', id: 'ledRojo', type: 'led', value: '0' },
    { name: 'Buzzer', id: 'buzzer', type: 'buzzer', value: '0' }
  ];

  leds: Sensor[] = this.sensors.filter(s => s.type === 'led');

  potentiometers: Potentiometer[] = [
    { value: 0, label: 'Stock bajo' },
    { value: 0, label: 'Stock agotado' }
  ];

  private updateSubscription!: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.initChart();
    this.loadConfig();
    this.loadSensorData();

    this.updateSubscription = interval(5000).subscribe(() => {
      this.loadSensorData();
    });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.inventoryChart) {
      this.inventoryChart.destroy();
    }
  }

  initChart() {
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Distancia (cm)',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 60 }
        }
      }
    };
    this.inventoryChart = new Chart(this.chartCanvas.nativeElement, config);
  }

  async loadConfig() {
    try {
      this.http.get<any>(`${this.API_BASE_URL}/api/configInit`).subscribe({
        next: (config) => {
          this.config = config;
          this.updateConfigUI();
        },
        error: (error) => {
          console.error('Error:', error);
          this.showAlert('Error al cargar la configuración', 'danger');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      this.showAlert('Error al cargar la configuración', 'danger');
    }
  }

  async loadSensorData() {
    try {
      this.http.get<SensorData[]>(`${this.API_BASE_URL}/api/data`).subscribe({
        next: (data) => {
          this.sensorData = data;
          this.updateSensorUI();
          this.updateHistoryTable();
        },
        error: (error) => {
          console.error('Error:', error);
          this.showAlert('Error al cargar datos de sensores', 'danger');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      this.showAlert('Error al cargar datos de sensores', 'danger');
    }
  }

  updateConfigUI() {
    this.sensors.forEach(sensor => {
      sensor.value = this.config[sensor.id] || '0';
    });
    this.potentiometers[0].value = parseInt(this.config.pot1) || 0;
    this.potentiometers[1].value = parseInt(this.config.pot2) || 0;
  }

  updateSensorUI() {
    this.sensors.forEach(sensor => {
      sensor.value = this.findLatestValue(sensor.name) || '0';
    });

    const distance = this.findLatestValue('Sensor Ultrasónico');
    if (distance) {
      this.currentDistance = parseInt(distance);
      this.updateChart(this.currentDistance);
    }

    const pot1 = this.findLatestValue('Potenciómetro 1');
    const pot2 = this.findLatestValue('Potenciómetro 2');
    if (pot1) this.potentiometers[0].value = parseInt(pot1);
    if (pot2) this.potentiometers[1].value = parseInt(pot2);
  }

  getSensorClasses(sensor: Sensor): string[] {
    const classes = ['led-indicator'];
    if (sensor.value === '0') return [...classes, 'led-off'];
    if (sensor.name.includes('Verde')) return [...classes, 'led-green'];
    if (sensor.name.includes('Amarillo')) return [...classes, 'led-yellow'];
    if (sensor.name.includes('Rojo')) return [...classes, 'led-red'];
    return classes;
  }

  updateChart(distance: number) {
    const now = new Date();
    const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    this.inventoryChart.data.labels!.push(timeLabel);
    this.inventoryChart.data.datasets[0].data.push(distance);

    if (this.inventoryChart.data.labels!.length > 10) {
      this.inventoryChart.data.labels!.shift();
      this.inventoryChart.data.datasets[0].data.shift();
    }
    this.inventoryChart.update();
  }

  updateHistoryTable() {
    this.history = [...this.sensorData]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }

  async saveConfig() {
    const config: { [key: string]: string } = {
      ...this.config,
      ...this.sensors.reduce((acc, sensor) => ({ ...acc, [sensor.id]: sensor.value }), {} as { [key: string]: string }),
      pot1: this.potentiometers[0].value.toString(),
      pot2: this.potentiometers[1].value.toString()
    };

    try {
      this.http.put(`${this.API_BASE_URL}/api/configInit`, config).subscribe({
        next: (updatedConfig) => {
          this.config = updatedConfig;
          this.showAlert('Configuración guardada correctamente', 'success');
          this.updateConfigUI();
        },
        error: (error) => {
          console.error('Error:', error);
          this.showAlert('Error al guardar la configuración', 'danger');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      this.showAlert('Error al guardar la configuración', 'danger');
    }
  }

  updatePotValues() {
    // Actualización automática mediante two-way binding
  }

  getThreshold(value: number, index: number): number {
    return index === 0 ? 
      this.mapValue(value, 0, 1023, 15, 30) : 
      this.mapValue(value, 0, 1023, 30, 60);
  }

  mapValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return Math.round((value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
  }

  findLatestValue(sensorName: string): string | null {
    const sensorItems = this.sensorData.filter(item => item.sensor === sensorName);
    if (sensorItems.length === 0) return null;
    return sensorItems.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].valor;
  }

  getProgressPercentage(): number {
    return Math.min(100, (this.currentDistance / parseInt(this.config.ultrasonico || '60')) * 100);
  }

  getProgressClass(): string {
    if (this.currentDistance <= 15) return 'progress-success';
    if (this.currentDistance <= 30) return 'progress-warning';
    return 'progress-danger';
  }

  showAlert(message: string, type: string) {
    console.log(`${type}: ${message}`);
  }
}