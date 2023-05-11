import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import MuserLink from "App/Models/MuserLink";
import MuserRole from "App/Models/MuserRole";
import MuserRoleMap from "App/Models/MuserRoleMap";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const roles = [
      {
        id: 1,
        title: "Administrator",
      },
      {
        id: 2,
        title: "Guest",
      }
    ]
    const links = [
      {
        id: 1,
        title: "หน้าหลัก",
        svg_icon: "",
        order: 1,
        target: "",
        slug: "/admin",
      },
      {
        id: 2,
        title: "ความรู้",
        svg_icon: "",
        order: 2,
        target: "_top",
        slug: "",
      },
      {
        id: 3,
        title: "ทังหมด",
        svg_icon: "",
        order: 3,
        slug: "/admin/knowledges",
        target: "_sub",
        parent: 2,
      },
      {
        id: 4,
        title: "หมวดหมู่",
        svg_icon: "",
        order: 4,
        slug: "/admin/knowledges/category",
        target: "_sub",
        parent: 2,
      },
      {
        id: 5,
        title: "ข่าวสาร",
        svg_icon: "",
        order: 5,
        slug: "",
        target: "_top",
      },
      {
        id: 6,
        title: "ทังหมด",
        svg_icon: "",
        order: 6,
        target: "_sub",
        slug: "/admin/blogs",
        parent: 5,
      },
      {
        id: 7,
        title: "หมวดหมู่",
        svg_icon: "",
        order: 7,
        slug: "/admin/blogs/category",
        target: "_sub",
        parent: 7,
      },
      {
        id: 8,
        title: "ผู้ใช้ระบบ",
        svg_icon: "",
        order: 8,
        slug: "/admin/users",
        target: "_sub",
        parent: 5,
      },
      {
        id: 9,
        title: "ผู้ใช้ละบบทังหมด",
        svg_icon: "",
        order:9,
        slug: "/admin/users",
        target: "_sub",
        parent:8
      },
      {
        id: 10,
        title: "User Roles",
        svg_icon: "",
        order: 10,
        slug: "/admin/users",
        target: "_sub",
        parent:8
      },
      {
        id: 11,
        title: "Section",
        svg_icon: "",
        order: 11,
        slug: "/admin/sections",
        target: ""
      },
      {
        id: 12,
        title: "Other",
        svg_icon: "",
        order: 12,
        slug: "/admin/sections",
        target: ""
      },
    ];
    const roleMaps = [
      {
        id: 1,
        roleId: 1,
        linkId: 1
      },
      {
        id: 2,
        roleId: 1,
        linkId: 2
      },
      {
        id: 3,
        roleId: 1,
        linkId: 3
      },
      {
        id: 4,
        roleId: 1,
        linkId: 4
      },
      {
        id: 5,
        roleId: 1,
        linkId: 5
      },
      {
        id: 6,
        roleId: 1,
        linkId: 6
      },
      {
        id: 7,
        roleId: 1,
        linkId: 7
      },
      {
        id: 8,
        roleId: 1,
        linkId: 8
      }
      ,
      {
        id: 9,
        roleId: 1,
        linkId: 9
      },
      {
        id: 10,
        roleId: 1,
        linkId: 10
      },
      {
        id: 11,
        roleId: 1,
        linkId: 11
      },
      {
        id: 12,
        roleId: 1,
        linkId: 12
      }
    ]
    await MuserLink.updateOrCreateMany(['id'], links)
    await MuserRole.updateOrCreateMany(['id'], roles)
    await MuserRoleMap.updateOrCreateMany(['id'], roleMaps)
  }
}
