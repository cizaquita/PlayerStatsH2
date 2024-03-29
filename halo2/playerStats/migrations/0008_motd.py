# Generated by Django 2.2.1 on 2019-06-06 04:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playerStats', '0007_auto_20190413_1621'),
    ]

    operations = [
        migrations.CreateModel(
            name='MOTD',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, unique=True)),
                ('message', models.TextField(blank=True, null=True)),
                ('creation_date', models.DateTimeField(auto_now_add=True, null=True)),
            ],
        ),
    ]
