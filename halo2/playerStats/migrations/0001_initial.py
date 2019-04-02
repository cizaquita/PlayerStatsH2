# Generated by Django 2.1 on 2019-02-27 01:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('best_spree', models.IntegerField()),
                ('best_spree_game_map', models.CharField(max_length=50)),
                ('best_spree_game_type', models.CharField(max_length=50)),
                ('best_spree_game_variant', models.CharField(max_length=50)),
                ('score', models.IntegerField()),
                ('kills', models.IntegerField()),
                ('assists', models.IntegerField()),
                ('deaths', models.IntegerField()),
                ('suicides', models.IntegerField()),
                ('register_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modification_date', models.DateTimeField()),
                ('last_game_map', models.CharField(max_length=100)),
                ('last_game_type', models.CharField(max_length=200)),
                ('last_game_variant', models.CharField(max_length=100)),
            ],
        ),
    ]