import { sDBCliente } from './../supabaseClient';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { from, Observable } from 'rxjs';
import { Category } from '../type/category';
import { Product } from '../type/product';
import { ProductTable } from '../type/productTabe';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private bucket = 'imageproduct';

  constructor() {

  }

  getCategorias() {
    return sDBCliente.from('categorias').select('*');
  }


public async getProductosByCategoria(categoryId: number): Promise<Product[]> {
  try {
    const { data, error } = await sDBCliente
      .from('Productos')
      .select('*')
      .eq('category_prod', categoryId);

    if (error || !data) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }

      const productosConImagen = await Promise.all(
        data.map(async (producto) => {
          const imageUrl = await this.getProductoImageUrl(producto);
          return {
            ...producto,
            image: imageUrl,
          };
        })
      );

    return productosConImagen;
  } catch (error) {
    console.error('Error al procesar productos con imagen:', error);
    throw error;
  }
}



  public getCategoriaById(categoryId: number) {
    return from(sDBCliente
      .from('Categorias')
      .select('*')
      .eq('id', categoryId));
  }

public async getAllProductos(): Promise<Product[]> {
  try {
    const { data, error } = await sDBCliente.from('Productos').select('*');
    if (error || !data) {
      throw error;
    }

    const productosConImagen = await Promise.all(
        data.map(async (producto) => {
          const imageUrl = await this.getProductoImageUrl(producto);
          return {
            ...producto,
            image: imageUrl,
          };
        })
      );

    return productosConImagen;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}


  public async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await sDBCliente.from('Categorias').select('*');
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error; // Relanzar o manejar según sea necesario
    }
  }
  getFeaturedProducts() {
    var categoriaId=1;
      const promise =  sDBCliente.from('productos').select('*').eq('categoriaId', categoriaId);
        return from(promise);
  }


public async getProducts(params: Params): Promise<{ data: Product[]; count: number | null }> {
  const page = Number.parseInt(params['page'] || '1');
  const pageSize = 12;
  const offset = (page - 1) * pageSize;

  let query = sDBCliente
    .from('productos')
    .select('*', { count: 'exact' })
    .range(offset, offset + pageSize - 1);

  if (params['categoryId']) {
    query = query.eq('categoriaId', params['categoryId']);
  }
  if (params['search']) {
    query = query.ilike('nombre', `%${params['search']}%`);
  }

  const { data, error, count } = await query;

  if (error || !data) {
    console.error('Error al obtener productos:', error);
    throw error;
  }

  const bucket = 'imageproduct';
  const productosConImagen = await Promise.all(
    data.map(async (producto) => {
      let imageUrl = '';
      const ext='webp';
        const fileName = `${producto.codigo}.${ext}`;
        const { data: fileData, error: fileError } = await sDBCliente
          .storage
          .from(bucket)
          .list('', { search: fileName });
        if (fileData?.some(file => file.name === fileName)) {
          const { data: urlData } = sDBCliente.storage.from(bucket).getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      return {
        ...producto,
        imageUrl,
      };
    })
  );
  return { data: productosConImagen, count };
}
  getCategoriesObservable() {
    return from(this.getCategorias());
  }
  public async getProductosFeature(): Promise<Product[]> {
    const { data, error } = await sDBCliente.from('Productos').select('*').eq("feature",true);

    if (error || !data) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }

    const productosConImagen = await Promise.all(
        data.map(async (producto) => {
          const imageUrl = await this.getProductoImageUrl(producto);
          return {
            ...producto,
            image: imageUrl,
          };
        })
      );
    return productosConImagen;

  }

  async searchProducts(term: string) : Promise<Product[]> {
    const { data, error } = await sDBCliente.from('Productos').select('*').ilike('title', `%${term}%`);

    if (error || !data) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }

    const productosConImagen = await Promise.all(
        data.map(async (producto) => {
          const imageUrl = await this.getProductoImageUrl(producto);
          return {
            ...producto,
            image: imageUrl,
          };
        })
      );
    return productosConImagen;
  }


async fetchProductos(): Promise<ProductTable[]> {

  const { data, error } = await sDBCliente.rpc('gettablaproductos');
  if (error)
    throw error;
  return data;
}

async updateProducto(product: Product): Promise<void> {
  const { error } = await sDBCliente.from('productos')
    .update({
      title: product.title,
      description: product.description,
      price: product.price
    })
    .eq('id', product.id);

  if (error) throw error;
}
async getProductoImageUrl(producto: Product): Promise<string> {
    const cod = producto.cod_prod?.trim().replace(/\s+/g, '') || 'default';
    let fileName: string;
    let imageUrl = '';
    const fallbackImage = '/cod_ImagenNoDisponible.webp';

    // Determina el nombre de archivo en base a la lógica original
    if (producto.price <= 0) {
      fileName = '/cod_SINSTOCK.webp';
    } else {
      fileName = `/${cod}.webp`;
    }

    try {
      // Intenta obtener la URL de la imagen específica
      const { data: urlData } = sDBCliente.storage.from(this.bucket).getPublicUrl(fileName);
      const url = urlData?.publicUrl;

      // Verifica si la URL es accesible (la imagen existe)
      if (url) {
        const response = await fetch(url);
        if (response.ok) {
          imageUrl = url;
        } else {
          // Si la imagen específica no existe, usa la imagen de fallback
          const { data: fallbackUrlData } = sDBCliente.storage.from(this.bucket).getPublicUrl(fallbackImage);
          imageUrl = fallbackUrlData?.publicUrl || '';
        }
      }
    } catch (err) {
      console.warn(`No se pudo acceder a la imagen para el producto ${cod}. Usando imagen de fallback.`, err);
      const { data: fallbackUrlData } = sDBCliente.storage.from(this.bucket).getPublicUrl(fallbackImage);
      imageUrl = fallbackUrlData?.publicUrl || '';
    }

    return imageUrl;
  }
}
