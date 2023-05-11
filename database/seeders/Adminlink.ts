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
        target: "_top",
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
        slug: "/knowledge",
        target: "_sub",
        parent: 2,
      },
      {
        id: 4,
        title: "หมวดหมู่",
        svg_icon: "",
        order: 4,
        slug: "/knowledge/category",
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
        slug: "/blogs",
        parent: 5,
      },
      {
        id: 7,
        title: "หมวดหมู่",
        svg_icon: "",
        order: 7,
        slug: "/blogs/category",
        target: "_sub",
        parent: 5,
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
        roleId: 2,
        linkId: 2
      },
      {
        id: 3,
        roleId: 3,
        linkId: 3
      },
      {
        id: 4,
        roleId: 4,
        linkId: 4
      },
      {
        id: 5,
        roleId: 5,
        linkId: 5
      },
      {
        id: 6,
        roleId: 6,
        linkId: 6
      },
      {
        id: 7,
        roleId: 7,
        linkId: 7
      }
    ]
    await MuserLink.updateOrCreateMany(['id'], links)
    await MuserRole.updateOrCreateMany(['id'], roles)
    await MuserRoleMap.updateOrCreateMany(['id'], roleMaps)
  }
}
