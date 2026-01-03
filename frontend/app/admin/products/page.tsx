'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';

interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    material: string;
    price: number;
    originalPrice?: number;
    images: string[];
    stock: number;
    sizes: string[];
    status: 'draft' | 'active' | 'archived';
    isFeatured: boolean;
    tags: string[];
    sku?: string;
    createdAt: string;
    updatedAt: string;
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'bracelet',
        material: 'Silver',
        price: 0,
        originalPrice: 0,
        images: [''],
        stock: 0,
        sizes: [] as string[],
        status: 'draft' as 'draft' | 'active' | 'archived',
        isFeatured: false,
        tags: [] as string[],
        sku: '',
    });

    const categories = ['bracelet', 'earrings', 'rings', 'chains'];
    const materials = ['Silver', 'Gold'];
    const statuses = ['draft', 'active', 'archived'];
    const availableSizes = ['6', '7', '8', '9', 'One Size'];

    useEffect(() => {
        fetchProducts();
    }, [searchTerm, filterCategory, filterStatus, currentPage]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params: any = {
                page: currentPage,
                limit: 12,
            };

            if (searchTerm) params.search = searchTerm;
            if (filterCategory) params.category = filterCategory;
            if (filterStatus) params.status = filterStatus;

            const response = await apiClient.get('/products', { params });
            if (response.data?.success) {
                setProducts(response.data.data);
                setTotalPages(response.data.pagination.pages);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async () => {
        try {
            const response = await apiClient.post('/products', {
                ...formData,
                images: formData.images.filter(img => img.trim() !== ''),
            });

            if (response.data?.success) {
                setShowAddModal(false);
                resetForm();
                fetchProducts();
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleUpdateProduct = async () => {
        if (!selectedProduct) return;

        try {
            const response = await apiClient.put(`/products/${selectedProduct._id}`, {
                ...formData,
                images: formData.images.filter(img => img.trim() !== ''),
            });

            if (response.data?.success) {
                setShowEditModal(false);
                setSelectedProduct(null);
                resetForm();
                fetchProducts();
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await apiClient.delete(`/products/${productId}`);
            if (response.data?.success) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            material: product.material,
            price: product.price,
            originalPrice: product.originalPrice || 0,
            images: product.images,
            stock: product.stock,
            sizes: product.sizes,
            status: product.status,
            isFeatured: product.isFeatured,
            tags: product.tags,
            sku: product.sku || '',
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: 'bracelet',
            material: 'Silver',
            price: 0,
            originalPrice: 0,
            images: [''],
            stock: 0,
            sizes: [] as string[],
            status: 'draft',
            isFeatured: false,
            tags: [] as string[],
            sku: '',
        });
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleSizeToggle = (size: string) => {
        const newSizes = formData.sizes.includes(size)
            ? formData.sizes.filter(s => s !== size)
            : [...formData.sizes, size];
        setFormData({ ...formData, sizes: newSizes });
    };

    const ProductModal = ({ isEdit = false }: { isEdit?: boolean }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h2>
                </div>

                <div className="p-6 space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                            <input
                                type="text"
                                value={formData.sku || ''}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                                placeholder="Auto-generated if empty"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                            <select
                                value={formData.material}
                                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                            >
                                {materials.map(mat => (
                                    <option key={mat} value={mat}>{mat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                            <input
                                type="number"
                                value={formData.originalPrice}
                                onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
                            <div className="flex items-center h-10">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-4 h-4 text-[#d4a574] border-gray-300 rounded focus:ring-[#d4a574]"
                                />
                                <span className="ml-2 text-sm text-gray-700">Feature this product</span>
                            </div>
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {availableSizes.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeToggle(size)}
                                    className={`px-3 py-1 rounded-md text-sm ${formData.sizes.includes(size)
                                        ? 'bg-[#d4a574] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                        {formData.images.map((image, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="url"
                                    value={image}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImageField(index)}
                                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImageField}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Add Image
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => {
                            isEdit ? setShowEditModal(false) : setShowAddModal(false);
                            resetForm();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={isEdit ? handleUpdateProduct : handleAddProduct}
                        className="px-4 py-2 bg-[#d4a574] text-white rounded-md hover:bg-[#c49560]"
                    >
                        {isEdit ? 'Update Product' : 'Add Product'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">Manage your product inventory</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                    }}
                    className="px-4 py-2 bg-[#d4a574] text-white rounded-md hover:bg-[#c49560]"
                >
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                    />

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                    >
                        <option value="">All Status</option>
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterCategory('');
                            setFilterStatus('');
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a574]"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No products found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Featured
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.sku}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${product.price}
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="ml-2 text-sm text-gray-500 line-through">
                                                    ${product.originalPrice}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' :
                                                product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {product.isFeatured ? '⭐' : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Page <span className="font-medium">{currentPage}</span> of{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                                    ? 'z-10 bg-[#d4a574] border-[#d4a574] text-white'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAddModal && <ProductModal />}
            {showEditModal && <ProductModal isEdit />}
        </div>
    );
}
