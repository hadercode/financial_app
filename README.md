# Finanza AI - Inteligencia Financiera

Finanza AI es una aplicación web moderna diseñada para la gestión inteligente de finanzas personales y empresariales. Permite el seguimiento de transacciones, la gestión de pagos parciales y ofrece asesoramiento financiero personalizado mediante inteligencia artificial (Google Gemini).

![Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Características Principales

-   **Dashboard Financiero**: Visualización clara de ingresos, gastos, cuentas por cobrar y por pagar.
-   **Asesor IA**: Análisis inteligente de tu situación financiera y recomendaciones personalizadas.
-   **Gestión de Transacciones**: Registro detallado con categorías, fechas de vencimiento y tipos.
-   **Pagos Parciales**: Registro de múltiples abonos a una misma transacción hasta su compleción.
-   **Historial de Pagos**: Seguimiento detallado de cada abono con descarga de comprobantes.
-   **PWA (Progressive Web App)**: Instalable en dispositivos móviles y de escritorio para acceso rápido.

## Stack Tecnológico

-   **Frontend**: React + Vite
-   **Lenguaje**: TypeScript
-   **Estilos**: Tailwind CSS
-   **Base de Datos y Autenticación**: Supabase
-   **IA**: Google Gemini API (@google/generai)
-   **Gráficos**: Recharts
-   **Formularios**: React Hook Form

## Requisitos Previos

-   **Node.js** (v18 o superior)
-   **npm** o **yarn**
-   Una cuenta en [Supabase](https://supabase.com/)
-   Una API Key de [Google Gemini](https://aistudio.google.com/)

## Instalación Local

1.  **Clonar el repositorio**:
    ```bash
    git clone <tu-repositorio-url>
    cd finanza-ai---inteligencia-financiera
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**:
    Crea un archivo `.env` o `.env.local` en la raíz del proyecto y añade tus credenciales:
    ```env
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
    GEMINI_API_KEY=tu_api_key_de_gemini
    ```

4.  **Configurar Supabase**:
    Ejecuta el siguiente SQL en el editor de SQL de Supabase para crear las tablas necesarias:

    ```sql
    -- Tabla de Transacciones
    CREATE TABLE transactions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      description TEXT NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      due_date DATE NOT NULL,
      type TEXT CHECK (type IN ('payable', 'receivable', 'fixed', 'income')),
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
      category TEXT DEFAULT 'General',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );

    -- Tabla de Pagos
    CREATE TABLE payments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
      user_id UUID REFERENCES auth.users(id),
      amount DECIMAL(12,2) NOT NULL,
      payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
      proof_url TEXT,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );

    -- Habilitar RLS (Row Level Security)
    ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

    -- Políticas de seguridad (Ejemplo: el usuario solo ve sus propios datos)
    CREATE POLICY "Users can manage their own transactions" ON transactions
      FOR ALL USING (auth.uid() = user_id);

    CREATE POLICY "Users can manage their own payments" ON payments
      FOR ALL USING (auth.uid() = user_id);
    ```

    **Importante**: Debes crear un bucket de Storage llamado `receipts` en Supabase y hacerlo público para las descargas de comprobantes.

5.  **Ejecutar la aplicación**:
    ```bash
    npm run dev
    ```

## Despliegue

Para generar la versión de producción:
```bash
npm run build
```
Los archivos optimizados se generarán en la carpeta `dist/`.

---
Desarrollado con ❤️ para una mejor inteligencia financiera.
