import { Component } from '@angular/core';

@Component({
  selector: 'app-contactanos',
  standalone: false,
  templateUrl: './contactanos.component.html',
  styleUrl: './contactanos.component.scss'
})
export class ContactanosComponent {
  faqs = [
    {
      q: '¿Realizan envíos a todo el país?',
      a: 'Sí, realizamos envíos a todo el territorio nacional. Los tiempos de entrega varían según la ubicación.',
    },
    {
      q: '¿Ofrecen descuentos para compras al mayoreo?',
      a: 'Sí, contamos con precios especiales para distribuidores y compras al mayoreo. Contáctanos para más información.',
    },
    {
      q: '¿Sus productos son seguros para usar en hogares con mascotas?',
      a: 'Todos nuestros productos están formulados pensando en la seguridad de tu familia y mascotas. Sin embargo, recomendamos mantenerlos fuera del alcance de niños y animales.',
    },
    {
      q: '¿Cómo puedo convertirme en distribuidor de Power Clean?',
      a: 'Para convertirte en distribuidor, por favor contáctanos a través del formulario o llámanos directamente. Te proporcionaremos toda la información necesaria.',
    },
  ];

  onSubmit(form: any) {
    console.log('Formulario enviado:', form.value);
    // Aquí puedes agregar la lógica para enviar el formulario a un backend
  }
}