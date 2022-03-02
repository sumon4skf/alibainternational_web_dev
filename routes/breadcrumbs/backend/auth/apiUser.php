<?php

Breadcrumbs::for('admin.auth.api.user.index', function ($trail) {
  $trail->push(__('Manage API Users'), route('admin.auth.api.user.index'));
});

Breadcrumbs::for('admin.auth.api.user.create', function ($trail) {
  $trail->parent('admin.auth.api.user.index');
  $trail->push(__('API User create'), route('admin.auth.api.user.create'));
});


Breadcrumbs::for('admin.auth.api.user.edit', function ($trail, $id) {
  $trail->parent('admin.auth.api.user.index');
  $trail->push(__('API User Update'), route('admin.auth.api.user.edit', $id));
});


Breadcrumbs::for('admin.auth.api.user.log', function ($trail, $id) {
  $trail->parent('admin.auth.api.user.index');
  $trail->push(__('API Call Log'), route('admin.auth.api.user.log', $id));
});