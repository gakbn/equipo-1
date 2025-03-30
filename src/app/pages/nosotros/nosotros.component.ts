import { Component } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  standalone: false,
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.scss'
})
export class NosotrosComponent {
  equipo = [
    { nombre: 'Carlos Rodríguez', cargo: 'Director General' },
    { nombre: 'Ana Martínez', cargo: 'Directora de Operaciones' },
    { nombre: 'Miguel Sánchez', cargo: 'Jefe de Producción' },
    { nombre: 'Laura Gómez', cargo: 'Directora de Ventas' }
  ];
  teamMembers = [
    {
      name: 'Carlos',
      role: 'Fundador y CEO',
      bio: 'Con más de 20 años de experiencia, Carlos fundó Power Clean con una visión innovadora.',
    },
    {
      name: 'Kevin',
      role: 'Director de Operaciones',
      bio: 'Kevin asegura la eficiencia en cada etapa del proceso operativo.',
    },
    {
      name: 'Perla',
      role: 'Directora de Investigación',
      bio: 'Perla lidera el desarrollo de fórmulas efectivas y sostenibles.',
    },
    {
      name: 'Rodolfo',
      role: 'Director Comercial',
      bio: 'Rodolfo impulsa el crecimiento de Power Clean en el mercado.',
    },
    {
      name: 'Gabriel',
      role: 'Director de Atención al Cliente',
      bio: 'Gabriel garantiza una experiencia excepcional para cada cliente.',
    },
  ];
}