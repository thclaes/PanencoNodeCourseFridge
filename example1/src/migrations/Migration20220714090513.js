'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220714090513 extends Migration {

  async up() {
    this.addSql('create table "recipe" ("id" uuid not null, "name" varchar(255) null, "description" varchar(255) null, "size" int null, "owner_id" uuid null);');
    this.addSql('alter table "recipe" add constraint "recipe_pkey" primary key ("id");');

    this.addSql('create table "fridge" ("id" uuid not null, "location" varchar(255) null, "capacity" int null);');
    this.addSql('alter table "fridge" add constraint "fridge_pkey" primary key ("id");');

    this.addSql('create table "product" ("id" uuid not null, "type" varchar(255) null, "name" varchar(255) null, "size" int null, "fridge_id" uuid null, "owner_id" uuid null);');
    this.addSql('alter table "product" add constraint "product_pkey" primary key ("id");');

    this.addSql('create table "product_recipe" ("id" uuid not null, "type" int not null, "product_id" uuid not null, "recipe_id" uuid not null);');
    this.addSql('alter table "product_recipe" add constraint "product_recipe_pkey" primary key ("id");');

    this.addSql('alter table "recipe" add constraint "recipe_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "product" add constraint "product_fridge_id_foreign" foreign key ("fridge_id") references "fridge" ("id") on update cascade on delete set null;');
    this.addSql('alter table "product" add constraint "product_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "product_recipe" add constraint "product_recipe_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
    this.addSql('alter table "product_recipe" add constraint "product_recipe_recipe_id_foreign" foreign key ("recipe_id") references "recipe" ("id") on update cascade;');
  }

  async down() {
    this.addSql('alter table "product_recipe" drop constraint "product_recipe_recipe_id_foreign";');

    this.addSql('alter table "product" drop constraint "product_fridge_id_foreign";');

    this.addSql('alter table "product_recipe" drop constraint "product_recipe_product_id_foreign";');

    this.addSql('drop table if exists "recipe" cascade;');

    this.addSql('drop table if exists "fridge" cascade;');

    this.addSql('drop table if exists "product" cascade;');

    this.addSql('drop table if exists "product_recipe" cascade;');
  }

}
exports.Migration20220714090513 = Migration20220714090513;
