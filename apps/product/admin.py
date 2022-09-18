from django.contrib import admin

from apps.product.models import Product, ProductImage

class ProductImageAdmin(admin.StackedInline):
    model = ProductImage


class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'compare_price',
                    'price', 'quantity', 'sold', )
    list_display_links = ('id', 'name', )
    list_filter = ('category', )
    list_editable = ('compare_price', 'price', 'quantity', )
    search_fields = ('name', 'description', )
    list_per_page = 25
    inlines = [ProductImageAdmin]
    class Meta:
       model = Product

admin.site.register(Product, ProductAdmin)
 
@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    pass