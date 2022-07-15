'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220714100251 extends Migration {

  async up() {
    this.addSql('alter table "recipe" drop column "size";');

    this.addSql('alter table "product_recipe" rename column "type" to "amount";');
  }

  async down() {
    this.addSql('alter table "product_recipe" rename column "amount" to "type";');

    this.addSql('alter table "recipe" add column "size" int4 null default null;');
  }

}
exports.Migration20220714100251 = Migration20220714100251;
