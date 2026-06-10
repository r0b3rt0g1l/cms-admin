# Mejoras pendientes del panel

Lista de mejoras detectadas durante el uso/documentación del panel. No son errores
bloqueantes del código, sino fricciones de experiencia que conviene resolver.

---

## 1. Agregar una foto a una noticia bloquea al usuario no técnico

**Contexto / por qué importa.**
El formulario de noticia (`NoticiaForm`) tiene el campo **URL de imagen** (un campo de
texto) y asume el flujo: *"suba la foto en Galería y pegue aquí su dirección"*. Pero la
sección **Galería** no expone esa dirección de ninguna forma usable:

- El detalle de una imagen (`src/app/(admin)/imagenes/[id]/page.jsx`) muestra título,
  sección, descripción y texto alternativo, **pero nunca la URL** de la imagen.
- No existe ningún botón de **copiar** en el panel (búsqueda de `clipboard`/`copiar`/
  `copy` en `src/` no devuelve resultados).

Resultado: el personal del ayuntamiento (perfil no técnico, poca experiencia con
computadoras) **no puede completar el paso de la foto** salvo recurriendo al clic
derecho del navegador → "copiar dirección de la imagen", que no es a prueba de novatos.
Mientras tanto, el manual de usuario instruye dejar el campo vacío y pedir ayuda a
soporte para agregar la foto.

**Opción mínima — botón "Copiar dirección".**
En el detalle de cada imagen (`imagenes/[id]`), mostrar la dirección de la imagen como
texto y un botón **"Copiar dirección"** (usando `navigator.clipboard.writeText`). Así el
usuario copia la URL de un clic y la pega en el campo **URL de imagen** de la noticia.
Cambio acotado, no toca el formulario de noticia.

**Opción ideal — selector de imágenes de la Galería en el formulario de noticia.**
Reemplazar el campo de texto **URL de imagen** del formulario de noticia
(`NoticiaForm`) por un **selector visual de imágenes de la Galería** (galería existente
en un modal/picker) o un **subir-foto directo** desde el propio formulario. El usuario
elige la imagen con un clic y **nunca tiene que ver ni pegar una URL**. Es la solución
que elimina la fricción de raíz.

**Recomendación.** Implementar la opción mínima de inmediato (desbloquea ya) y planear
la opción ideal como mejora de fondo.
