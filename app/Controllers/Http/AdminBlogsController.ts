import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import MContent from "App/Models/MContent";
import MContentCategory from "App/Models/MContentCategory";
import Mfavo from "App/Models/Mfavo";
import Mfileupload from "App/Models/Mfileupload";
import Muser from "App/Models/Muser";
import CategoryValidator from "App/Validators/CategoryValidator";
import ContentValidator from "App/Validators/ContentValidator";
import SectionValidator from "App/Validators/SectionValidator";

export default class AdminBlogsController {
  public async adminBlogsMange({ request, auth, view }: HttpContextContract) {
    const { search, type, page } = request.all();
    let blogs;
    const userAuth = await auth.use("web").authenticate();
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if ((search && search != "") || (type && type != "")) {
      blogs = await MContent.query()
        .preload("category")
        .where("slug", "BLOG")
        .preload('owner', (q) => {
          q.select('maker', 'avatar', 'firstname', 'lastname')
        })
        .andWhereRaw(`title like '%${search ? search : ""}%'`)
        .paginate(page || 1, 8);
    } else {
      blogs = await MContent.query()
        .preload("category")
        .preload('owner', (q) => {
          q.select('maker', 'avatar', 'firstname', 'lastname')
        })
        .where("slug", "BLOG")
        .paginate(page || 1, 8);
    }
    return view.render("admin/blogs/index", {
      blogs,
      search: search ? search : "",
      dataUser,
    });
  }
  public async clientBlogsMange({ request, auth, view }: HttpContextContract) {
    const { search, type, page } = request.all();
    let blogs;
    const userAuth = await auth.use("web").authenticate();
    const category = await MContentCategory.query().where('slug', 'KNWL')
    const otherItem = await MContent.query().select('title', 'id').where('slug', 'OTH').andWhere('status', 'P')
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if ((search && search != "") || (type && type != "")) {
      blogs = await MContent.query()
        .preload("category")
        .where("slug", "BLOG")
        .preload('owner', (q) => {
          q.select('maker', 'avatar', 'firstname', 'lastname')
        })
        .andWhereRaw(`title like '%${search ? search : ""}%'`)
        .andWhere('maker', userAuth.id)
        .paginate(page || 1, 8);
    } else {
      blogs = await MContent.query()
        .preload("category")
        .preload('owner', (q) => {
          q.select('maker', 'avatar', 'firstname', 'lastname')
        })
        .andWhere('maker', userAuth.id)
        .where("slug", "BLOG")
        .paginate(page || 1, 8);
    }
    return view.render("blog/listBlog", {
      blogs,
      search: search ? search : "",
      dataUser,
      otherItem,
      category
    });
  }
  public async adminBlogsCategory({
    request,
    view,
    auth,
  }: HttpContextContract) {
    const { search, type } = request.all();
    let categories;
    const userAuth = await auth.use("web").authenticate();
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if ((search && search != "") || (type && type != "")) {
      categories = await MContentCategory.query()
        .where("slug", "BLOG")
        .andWhereRaw(`title like '%${search ? search : ""}%'`)
        .paginate(1, 50);
    } else {
      categories = await MContentCategory.query()
        .where("slug", "BLOG")
        .paginate(1, 8);
    }
    return view.render("admin/blogs/category", {
      categories,
      search: search ? search : "",
      dataUser,
    });
  }

  public async adminBlogsStore({
    request,
    session,
    response,
    auth
  }: HttpContextContract) {
    await auth.use('web').authenticate()

    try {
      const { act, docfile } = request.all();
      const payload = await request.validate(ContentValidator);
      const content = await MContent.create(Object.assign(payload, { maker: auth.use('web').user!.id }));
      if (docfile) {
        for (let i = 0; i < docfile.length; i++) {
          await Mfileupload.create({ file_path: docfile[i], file_type: 'PDF', contentId: content?.$attributes.id })
        }
      }
      session.flash("notifySuccess", { message: "create_success" });
      response.redirect(`${act}`);
      // return payload 
    } catch (error) {
      console.log(error)
      session.flash('errors', error)
      return response.redirect().back()
      // return response.status(200).json(error)
    }
  }

  public async adminBlogsForm({ request, view, auth }: HttpContextContract) {
    const { typ, id } = request.all();
    let content;
    const userAuth = await auth.use("web").authenticate();
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if (typ == "edit" && id) {
      content = await MContent.query()
        .preload("category")
        .preload('files')
        .whereIn("slug", ["BLOG"])
        .andWhere("id", id)
        .first();
    }
    const categories = await MContentCategory.query().where("slug", "BLOG");
    return view.render("admin/blogs/form", {
      categories,
      content,
      type: {
        method: typ == "edit" ? "POST" : "POST",
        route: typ == "edit" ? "ContentUpdate" : "ContentCreate",
      },
      action:
        typ != "edit" ? "/v1/content/create" : "/v1/content/update?_method=PUT",
      dataUser,
    });
  }
  public async clientBlogsForm({ request, view, auth }: HttpContextContract) {
    const { typ, id } = request.all();
    let content;
    const userAuth = await auth.use("web").authenticate();
    const category = await MContentCategory.query().where('slug', 'KNWL')
    const otherItem = await MContent.query().select('title', 'id').where('slug', 'OTH').andWhere('status', 'P')
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if (typ == "edit" && id) {
      content = await MContent.query()
        .preload("category")
        .preload('files')
        .whereIn("slug", ["BLOG"])
        .andWhere("id", id)
        .first();
    }
    const categories = await MContentCategory.query().where("slug", "BLOG");
    return view.render("blog/form", {
      categories,
      content,
      type: {
        method: typ == "edit" ? "POST" : "POST",
        route: typ == "edit" ? "ContentUpdate" : "ContentCreate",
      },
      action:
        typ != "edit" ? "/v1/content/create" : "/v1/content/update?_method=PUT",
      dataUser,
      otherItem,
      category
    });
  }

  public async adminBlogsCategoryForm({
    request,
    auth,
    view,
  }: HttpContextContract) {
    const userAuth = await auth.use("web").authenticate();
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    try {
      const { typ, id } = request.all();
      let category;
      if (typ == 'edit' && id) {
        category = await MContentCategory.query().where('id', id).first()
      }
      return view.render('admin/blogs/formCate', {
        category: typ == 'edit' ? category : '',
        dataUser,
        act: typ == 'edit' ? 'edit' : ''
      })
      // session.flash("notifySuccess", { message: "create_success" });
      // response.redirect(`${act}`);
      // return payload
    } catch (error) {
      console.log(error);
    }
  }
  public async adminBlogsCategoryCreate({
    request,
    session,
    response,
  }: HttpContextContract) {
    try {
      const playload = await request.validate(CategoryValidator)
      await MContentCategory.create(playload)
      response.redirect('/admin/blogs/categories')
    } catch (error) {
      session.flash('errors', error)
      response.redirect().back()
    }
  }
  public async adminBlogsCategoryUpdate({
    request,
    response,
    session
  }: HttpContextContract) {
    const { id } = request.all();
    try {
      const playload = await request.validate(CategoryValidator)
      await MContentCategory.query().where('id', id).update(playload)
      response.redirect('/admin/blogs/categories')
    } catch (error) {
      session.flash('errors', error)
      response.redirect().back()
      // return response.status(200).json(error)
    }
  }
  public async adminBlogsCategoryDelete({
    request,
    response,
  }: HttpContextContract) {
    const { id } = request.all();
    try {
      await MContentCategory.query().where('id', id).delete()
      response.redirect('/admin/blogs/categories')
    } catch (error) {
      response.redirect().back()
      // return response.status(200).json(error)
    }
  }


  //
  public async adminSections({ request, view, auth }: HttpContextContract) {
    const { search } = request.all();
    const userAuth = await auth.use("web").authenticate();
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    let data;
    if (search && search != "") {
      data = await MContent.query()
        .preload("category")
        .whereIn("slug", ["QAFG", "HOME1"])
        .andWhereRaw(`title like '%${search ? search : ""}%'`)
        .paginate(1, 50);
    } else {
      data = await MContent.query()
        .preload("category")
        .whereIn("slug", ["QAFG", "HOME1"])
        .paginate(1, 50);
    }
    return view.render("admin/sections/index", {
      data,
      dataUser,
      search: search ? search : "",
    });
  }
  public async adminSectionsForm({ request, session, view, auth, response }: HttpContextContract) {
    try {
      const { typ, id } = request.all();
      let content;
      const userAuth = await auth.use("web").authenticate();
      const dataUser = await Muser.query()
        .select("id", "firstname", "lastname", "email", "mobile", "role")
        .preload("hasRole", (qr) => {
          qr.preload("links");
        })
        .where("id", userAuth.id)
        .first();
      if (typ == "edit" && id) {
        content = await MContent.query()
          .preload("category")
          .whereIn("slug", ["QAFG", "HOME1"])
          .where("id", id)
          .first();
      }
      const categories = await MContentCategory.query().whereIn("slug", [
        "QAFG",
        "HOME1",
      ]);
      return view.render("admin/sections/form", {
        categories,
        content,
        type: {
          method: typ == "edit" ? "PUT" : "POST",
          route: typ == "edit" ? "ContentUpdate" : "ContentCreate",
        },
        dataUser,
      });
    } catch (error) {
      session.flash('errors', error)
      return response.redirect().back()
    }
  }

  public async ContentUpdate({ request, response, auth }: HttpContextContract) {

    const { typ, id, docfile,act } = request.all();

    try {
      const playload = await request.validate(ContentValidator);
      await MContent.query().where("id", id).update(playload).first();
      await Mfileupload.query().where('contentId', id).delete()
      if (docfile) {
        for (let i = 0; i < docfile.length; i++) {
          await Mfileupload.create({ file_path: docfile[i], file_type: 'PDF', contentId: id })
        }
      }
      if (playload.slug == 'KNWL') {
          response.redirect(`${act}`)
      } else if (playload.slug == 'BLOG') {
        response.redirect(`${act}`)
      } else if (playload.slug == 'CRSEL') {
        response.redirect('/admin/carousel')
      } else {
        response.redirect('/admin/other')
      }
    } catch (error) {
      response.redirect().back()
    }

  }

  public async adminknowledges({ request, view, auth }: HttpContextContract) {
    const { search,page } = request.all();
    const userAuth = await auth.use("web").authenticate();
    let data;
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if (search && search != "") {
      data = await MContent.query()
        .preload("category")
        .whereIn("slug", ["KNWL"])
        .preload('owner', (q) => {
          q.select('maker', 'avatar', 'firstname', 'lastname')
        })
        .andWhereRaw(`title like '%${search ? search : ""}%'`)
        .paginate(page || 1, 50);
    } else {
      data = await MContent.query()
        .preload("category")
        .preload('owner', (q) => {
          q.select('maker', 'avatar', 'firstname', 'lastname')
        })
        .whereIn("slug", ["KNWL"])
        .paginate(page || 1, 8);
    }
    return view.render("admin/knowledge/index", {
      data,
      dataUser,
      search: search ? search : "",
    });
  }
  public async clientknowledges({ request, view, auth }: HttpContextContract) {
    const { search } = request.all();
    const userAuth = await auth.use("web").authenticate();
    const category = await MContentCategory.query().where('slug', 'KNWL')
    const otherItem = await MContent.query().select('title', 'id').where('slug', 'OTH').andWhere('status', 'P')
    let data;
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if (search && search != "") {
      data = await MContent.query()
        .preload("category")
        .whereIn("slug", ["KNWL"])
        .preload('owner', (q) => {
          q.select('maker', 'avatar', 'firstname', 'lastname')
        })
        .andWhereRaw(`title like '%${search ? search : ""}%'`)
        .andWhere('maker', userAuth.id)
        .paginate(1, 50);
    } else {
      data = await MContent.query()
        .preload("category")
        .preload('owner', (q) => {
          q.select('maker', 'avatar', 'firstname', 'lastname')
        })
        .whereIn("slug", ["KNWL"])
        .andWhere('maker', userAuth.id)
        .paginate(1, 50);
    }
    return view.render("knowledge/listKnowledge", {
      data,
      dataUser,
      search: search ? search : "",
      category,
      otherItem
    });
  }
  public async adminknowledgesCategory({
    request,
    view,
    auth,
  }: HttpContextContract) {
    const { search, type } = request.all();
    let categories;
    const userAuth = await auth.use("web").authenticate();
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if ((search && search != "") || (type && type != "")) {
      categories = await MContentCategory.query()
        .where("slug", "KNWL")
        .andWhereRaw(`title like '%${search ? search : ""}%'`)
        .paginate(1, 50);
    } else {
      categories = await MContentCategory.query()
        .where("slug", "KNWL")
        .paginate(1, 8);
    }
    return view.render("admin/knowledge/category", {
      categories,
      search: search ? search : "",
      dataUser,
    });
  }
  public async adminknowledgesCategoryForm({ request, auth, view }: HttpContextContract) {
    const { typ, id } = request.all()
    const userAuth = await auth.use("web").authenticate();
    let category;
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if (typ == "edit" && id) {
      category = await MContentCategory.query().where('id', id).first()
    }
    return view.render('admin/knowledge/formCate', { dataUser, category: typ == 'edit' ? category : '', act: typ == 'edit' ? 'edit' : '' })

  }
  public async adminknowledgesCategoryCreate({ request, session, response }: HttpContextContract) {
    const payload = await request.validate(CategoryValidator)
    try {
      await MContentCategory.create(payload)
      response.redirect('/admin/knowledges/category')
    } catch (error) {
      session.flash('errors', error)
      response.redirect().back()
    }
  }
  public async adminknowledgesCategoryUpdate({ request, response }: HttpContextContract) {
    const { id } = request.all()
    const payload = await request.validate(CategoryValidator)
    try {
      await MContentCategory.query().where('id', id).update(payload)
      response.redirect('/admin/knowledges/category')
    } catch (error) {
      response.redirect().back()
    }
  }
  public async adminknowledgesCategoryDelete({ request, response }: HttpContextContract) {
    const { id } = request.all()
    try {
      await MContentCategory.query().where('id', id).delete()
      response.redirect('/admin/knowledges/category')
    } catch (error) {
      response.redirect().back()
    }
  }

  public async adminknowledgesForm({
    request,
    view,
    auth,
  }: HttpContextContract) {
    try {
      const { typ, id } = request.all();
      let content;
      const userAuth = await auth.use("web").authenticate();
      const dataUser = await Muser.query()
        .select("id", "firstname", "lastname", "email", "mobile", "role")
        .preload("hasRole", (qr) => {
          qr.preload("links");
        })
        .where("id", userAuth.id)
        .first();
      if (typ == "edit" && id) {
        content = await MContent.query()
          .preload("category")
          .preload('files')
          .whereIn("slug", ["KNWL"])
          .where("id", id)
          .first();
      }
      const categories = await MContentCategory.query().whereIn("slug", [
        "KNWL",
      ]);
      return view.render("admin/knowledge/form", {
        categories,
        content,
        type: {
          method: typ == "edit" ? "PUT" : "POST",
          route: typ == "edit" ? "ContentUpdate" : "ContentCreate",
        },
        action:
          typ != "edit" ? "/v1/content/create" : "/v1/content/update?_method=PUT",
        dataUser,
      });
    } catch (error) { }
  }
  public async clientknowledgesForm({
    request,
    view,
    auth,
  }: HttpContextContract) {
    try {
      const { typ, id } = request.all();
      let content;
      const userAuth = await auth.use("web").authenticate();
      const dataUser = await Muser.query()
        .select("id", "firstname", "lastname", "email", "mobile", "role")
        .preload("hasRole", (qr) => {
          qr.preload("links");
        })
        .where("id", userAuth.id)
        .first();
      if (typ == "edit" && id) {
        content = await MContent.query()
          .preload("category")
          .preload('files')
          .whereIn("slug", ["KNWL"])
          .where("id", id)
          .first();
      }
      const categories = await MContentCategory.query().whereIn("slug", [
        "KNWL",
      ]);
      return view.render("knowledge/form", {
        categories,
        content,
        type: {
          method: typ == "edit" ? "PUT" : "POST",
          route: typ == "edit" ? "ContentUpdate" : "ContentCreate",
        },
        action:
          typ != "edit" ? "/v1/content/create" : "/v1/content/update?_method=PUT",
        dataUser,
      });
    } catch (error) { }
  }
  public async clientFavore({ request, response, auth }: HttpContextContract) {
    try {
      const { id } = request.all()
      const userAuth = await auth.use("web").authenticate();
      await Mfavo.create({ contId: id, userId: userAuth.id })
      response.redirect().back()
    } catch (error) {

    }
  }
  public async clientIndexFavore({ request, view, auth }: HttpContextContract) {
    try {
      const { typ, id } = request.all();
      let content;
      const userAuth = await auth.use("web").authenticate();
      const dataUser = await Muser.query()
        .select("id", "firstname", "lastname", "email", "mobile", "role")
        .preload("hasRole", (qr) => {
          qr.preload("links");
        })
        .where("id", userAuth.id)
        .first();
      if (typ == "edit" && id) {
        content = await MContent.query()
          .preload("category")
          .preload('files')
          .whereIn("slug", ["KNWL"])
          .where("id", id)
          .first();
      }
      const categories = await MContentCategory.query().whereIn("slug", [
        "KNWL",
      ]);
      return view.render("knowledge/form", {
        categories,
        content,
        type: {
          method: typ == "edit" ? "PUT" : "POST",
          route: typ == "edit" ? "ContentUpdate" : "ContentCreate",
        },
        action:
          typ != "edit" ? "/v1/content/create" : "/v1/content/update?_method=PUT",
        dataUser,
      });
    } catch (error) { }
  }
  public async adminOther({ request, view, auth }: HttpContextContract) {
    const { search } = request.all();
    const userAuth = await auth.use("web").authenticate();
    let data;
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if (search && search != "") {
      data = await MContent.query()
        .preload("category")
        .whereIn("slug", ["OTH", "FAQ"])
        .andWhereRaw(`title like '%${search ? search : ""}%'`)
        .paginate(1, 50);
    } else {
      data = await MContent.query()
        .preload("category")
        .whereIn("slug", ["OTH", "FAQ"])
        .paginate(1, 8);
    }
    return view.render("admin/pages/view", {
      data,
      dataUser,
      search: search ? search : "",
    });
  }
  public async adminOtherForm({ request, view, auth }: HttpContextContract) {
    try {
      const { typ, id } = request.all();
      let content;
      const userAuth = await auth.use("web").authenticate();
      const dataUser = await Muser.query()
        .select("id", "firstname", "lastname", "email", "mobile", "role")
        .preload("hasRole", (qr) => {
          qr.preload("links");
        })
        .where("id", userAuth.id)
        .first();
      if (typ == "edit" && id) {
        content = await MContent.query()
          .preload("category")
          .whereIn("slug", ["OTH", "FAQ"])
          .where("id", id)
          .first();
      }
      const categories = await MContentCategory.query().whereIn("slug", [
        "OTH",
      ]);
      return view.render("admin/pages/form", {
        categories,
        content,
        type: {
          method: typ == "edit" ? "PUT" : "POST",
          route: typ == "edit" ? "ContentUpdate" : "ContentCreate",
        },
        dataUser,
      });
    } catch (error) { }
  }

  public async adminCarousel({ request, view, auth }: HttpContextContract) {
    const { search } = request.all();
    const userAuth = await auth.use("web").authenticate();
    let data;
    const dataUser = await Muser.query()
      .select("id", "firstname", "lastname", "email", "mobile", "role")
      .preload("hasRole", (qr) => {
        qr.preload("links");
      })
      .where("id", userAuth.id)
      .first();
    if (search && search != "") {
      data = await MContent.query()
        .preload("category")
        .whereIn("slug", ["CRSEL"])
        .andWhereRaw(`title like '%${search ? search : ""}%'`)
        .paginate(1, 50);
    } else {
      data = await MContent.query()
        .preload("category")
        .whereIn("slug", ["CRSEL"])
        .paginate(1, 8);
    }
    return view.render("admin/carousel/view", {
      data,
      dataUser,
      search: search ? search : "",
    });
  }

  public async adminCarouselForm({ request, view, auth }: HttpContextContract) {
    try {
      const { typ, id } = request.all();
      let content;
      const userAuth = await auth.use("web").authenticate();
      const dataUser = await Muser.query()
        .select("id", "firstname", "lastname", "email", "mobile", "role")
        .preload("hasRole", (qr) => {
          qr.preload("links");
        })
        .where("id", userAuth.id)
        .first();
      if (typ == "edit" && id) {
        content = await MContent.query()
          .preload("category")
          .whereIn("slug", ["CRSEL"])
          .where("id", id)
          .first();
      }
      const categories = await MContentCategory.query().whereIn("slug", [
        "CRSEL",
      ]);
      return view.render("admin/carousel/form", {
        categories,
        content,
        type: {
          method: typ == "edit" ? "PUT" : "POST",
          route: typ == "edit" ? "ContentUpdate" : "ContentCreate",
        },
        dataUser,
      });
    } catch (error) { }
  }


}
