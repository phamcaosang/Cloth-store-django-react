# Generated by Django 3.1.7 on 2022-09-16 06:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0003_auto_20220916_1133'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='photo',
            field=models.FileField(upload_to='photos/%Y/%m/'),
        ),
    ]
