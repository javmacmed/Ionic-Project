import { NgModule } from '@angular/core';
import { AlterOrderPipe } from './alter.order.pipe';
import { SpellPipe } from './spell.pipe';

@NgModule({
declarations: [AlterOrderPipe, SpellPipe],
imports: [],
exports: [AlterOrderPipe, SpellPipe],
})

export class PipesModule {}
