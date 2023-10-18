import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Inicio',
    url: '/home/home',
    icon: 'icon-home',
  },
  {
    title: true,
    name: 'Administracion'
  },
  {
    name: 'Administracion',
    url: '/administration',
    icon: 'icon-menu',
    children: [
      {
        name: 'Usuario',
        url: '/administration/user',
        icon: 'icon-user'
      },
      {
        name: 'Cargar itineario',
        url: '/administration/loadItinerary',
        icon: 'icon-user'
      },
      {
        name: 'Roles',
        url: '/administration/role',
        icon: 'icon-cursor'
      },
      {
        name: 'Módulo',
        url: '/administration/module',
        icon: 'icon-cursor'
      },
      {
        name: 'Roles y Modulos',
        url: '/administration/roleModule',
        icon: 'icon-cursor'
      }
    ]
  },
  {
    name: 'Customer service',
    url: '/customer-service',
    icon: 'icon-menu',
    children: [
      {
        name: 'Cotizacion',
        url: '/customer-service/quotation-dashboard',
        icon: 'icon-doc'
      },
      {
        name: 'Asignar usuario - Cotizacion',
        url: '/customer-service/quotation-user-assignment',
        icon: 'icon-doc'
      }
    ]
  },
  {
    name: 'Pharma',
    url: '/pharma',
    icon: 'icon-menu',
    children: [
      {
        name: 'Track AWB',
        url: '/pharma/track-awb',
        icon: 'icon-doc'
      }
    ]
  }
];
