# Generated by Django 5.1.3 on 2025-01-11 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='center',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('center_id', models.IntegerField()),
                ('choice', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='voters',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('center_id', models.IntegerField()),
                ('has_vote', models.BooleanField()),
            ],
        ),
    ]