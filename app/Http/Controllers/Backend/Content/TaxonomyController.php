<?php

namespace App\Http\Controllers\Backend\Content;

use App\Http\Controllers\Controller;
use App\Models\Content\Taxonomy;
use Carbon\Carbon;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TaxonomyController extends Controller
{

  public $mainCategories = [];


  public function __construct(Taxonomy $taxonomy)
  {
    $taxonomies = $taxonomy->with(['parent', 'children' => function ($query) {
      $query->with('children');
    }])->withCount('children')->get();
    Cache::put('taxonomies', $taxonomies, now()->addDays(90));
    $this->mainCategories = $taxonomies->whereNull("ParentId");
  }


  /**
   * Display a listing of the resource.
   *
   * @return Factory|\Illuminate\View\View
   */
  public function index()
  {
    // $this->refresh_root_taxonomy();
    $mainCategories = $this->mainCategories;
    // dd($mainCategories);
    return view('backend.content.taxonomy.index', compact('mainCategories'));
  }



  /**
   * Show the form for creating a new resource.
   *
   * @return Factory|\Illuminate\View\View
   */
  public function create()
  {
    return view('backend.content.taxonomy.create');
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param Request $request
   * @return Response
   * @throws \Throwable
   */
  public function store(Request $request)
  {
    $data = $this->validateTaxonomies();
    DB::transaction(function () use ($data) {
      Taxonomy::create($data);
    });


    $redirect = request('redirect');
    $redirect = $redirect ? $redirect : 'admin.taxonomy.index';

    return redirect()->route($redirect)->withFlashSuccess('Taxonomy Created Successfully');
  }


  /**
   * Show the form for editing the specified resource.
   *
   * @param Taxonomy $taxonomy
   * @return Factory|\Illuminate\View\View
   */
  public function edit(Taxonomy $taxonomy)
  {
    return view('backend.content.taxonomy.edit', ['taxonomy' => $taxonomy]);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param Request $request
   * @param Taxonomy $taxonomy
   * @return Response
   */
  public function update(Request $request, Taxonomy $taxonomy)
  {
    $data = $this->validateTaxonomies($taxonomy->id);

    DB::transaction(function () use ($taxonomy, $data) {
      $taxonomy->update($data);
    });

    $redirect = request('redirect');
    $redirect = $redirect ? $redirect : 'admin.taxonomy.index';

    return redirect()->route($redirect)->withFlashSuccess('Taxonomy Updated Successfully');
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param Taxonomy $taxonomy
   * @return Response
   * @throws \Exception
   */
  public function destroy($id)
  {
    $taxonomy = Taxonomy::withTrashed()->find($id);
    if ($taxonomy->trashed()) {
      $taxonomy->forceDelete();
      return \response([
        'status' => true,
        'icon' => 'success',
        'msg' => 'Taxonomy permanently deleted',
      ]);
    } else if ($taxonomy->delete()) {
      return \response([
        'status' => true,
        'icon' => 'success',
        'msg' => 'Taxonomy moved to trashed successfully',
      ]);
    }

    return \response([
      'status' => false,
      'icon' => 'error',
      'msg' => 'Delete failed',
    ]);
  }

  public function trashed()
  {
    return view('backend.content.taxonomy.trashed', [
      'taxonomies' => Taxonomy::onlyTrashed()->latest()->paginate(10)
    ]);
  }

  public function restore()
  {
    $restore_id = \request('restore_id');
    Taxonomy::onlyTrashed()->findOrFail($restore_id)->restore();
    return redirect()->route('admin.taxonomy.trashed')->withFlashSuccess('Taxonomy Recovered Successfully');
  }

  public function validateTaxonomies($update_id = 0)
  {
    $unique = $update_id ? 'unique:taxonomies,name,' . $update_id : 'unique:taxonomies,name';
    $data =  request()->validate([
      'active' => 'nullable|date_format:Y-m-d H:i:s',
      'is_top' => 'nullable|date_format:Y-m-d H:i:s',
      // 'name' => "required|string|max:255|{$unique}",
      'name' => "required|string|max:255",
      'keyword' => "nullable|string|max:255",
      'description' => 'nullable|string|max:1800',
      'ParentId' => 'nullable|string|max:255',
      'icon' => 'nullable|max:1800|mimes:jpeg,jpg,png,gif,webp',
      'picture' => 'nullable|max:1800|mimes:jpeg,jpg,png,gif,webp',
    ]);

    $data['slug'] = Str::slug(request('name'));

    unset($data['icon'], $data['picture']);

    $data['active'] = request('active', null);
    $data['is_top'] = request('is_top', null);

    if (!$update_id) {
      $data['user_id'] = auth()->id();
    }

    if (request()->hasFile('picture')) {
      $file = request()->file('picture');
      $fileName = str_replace(".", "", Str::limit($data['slug'], 15)) . '-' . time();
      $data['picture'] = store_picture($file, 'taxonomy/picture/', $fileName);
    }
    if (request()->hasFile('icon')) {
      $file = request()->file('icon');
      $fileName = str_replace(".", "", Str::limit($data['slug'], 15)) . '-' . time();
      $data['icon'] = store_picture($file, 'taxonomy/icon/', $fileName);
    }

    return $data;
  }



  public function makeAsTop()
  {
    $ids = json_decode(request('ids'), true);
    $top = request('top');
    Taxonomy::whereIn('id', $ids)
      ->update([
        'is_top' => $top ? now() : NULL
      ]);

    return response([
      'status' => true,
      'msg' => $top ? 'Categories mark as top successfully' : 'Categories remove from top successfully'
    ]);
  }

  public function makeActive()
  {
    $ids = json_decode(request('ids'), true);
    $active = request('active');

    $taxonomy = Taxonomy::with('children')->whereIn('id', $ids);
    $taxonomyIds = $taxonomy->pluck('otc_id')->toArray() ?? [];
    $children = Taxonomy::whereIn('ParentId', $taxonomyIds);
    $childIds = $children->pluck('otc_id')->toArray() ?? [];
    Taxonomy::whereIn('ParentId', $childIds)->update([
      'active' => $active ? now() : NULL
    ]);
    $children->update([
      'active' => $active ? now() : NULL
    ]);
    $taxonomy->update([
      'active' => $active ? now() : NULL
    ]);

    return response([
      'status' => true,
      'msg' => $active ? 'Categories active successfully' : 'Categories Inactive successfully'
    ]);
  }


  public function makeDelete()
  {
    $ids = json_decode(request('ids'), true);

    $taxonomy = Taxonomy::with('children')->whereIn('id', $ids);
    $taxoIds = $taxonomy->pluck('otc_id')->toArray() ?? [];
    $children = Taxonomy::whereIn('ParentId', $taxoIds);
    $childIds = $children->pluck('otc_id')->toArray() ?? [];
    Taxonomy::whereIn('ParentId', $childIds)->delete();
    $children->delete();
    $taxonomy->delete();

    return response([
      'status' => true,
      'msg' => 'Categories deleted successfully'
    ]);
  }
}
