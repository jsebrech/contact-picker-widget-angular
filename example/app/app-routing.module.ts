import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoLocalPage } from './pages/demo-local';
import { DemoRemotePage } from './pages/demo-remote';
import { NoContentPage } from './pages/no-content.page';

export const ROUTES: Routes = [
    { path: '', redirectTo: '/demo-local', pathMatch: 'full' },
    { path: 'demo-local', component: DemoLocalPage },
    { path: 'demo-remote', component: DemoRemotePage },
    { path: '**', component: NoContentPage }
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
