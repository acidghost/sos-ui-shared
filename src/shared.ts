export class Environment {
  constructor(public production: boolean, public backendUrl: string) { }
}


export class Language {
  constructor(public code: string) {}
}


export class Skill {

  constructor(public id: number,
              public name: string) {}

  public static fromJson(json: any): Skill {
    return new Skill(json.id, json.name)
  }

}


export enum MembershipType {
  OnlySos = 0,
  OnlyFablab,
  BothMembership
}

export function membershipTypeToString(membershipType: MembershipType): string {
  switch (membershipType) {
    case MembershipType.OnlySos:
      return 'sos';
    case MembershipType.OnlyFablab:
      return 'fablab';
    case MembershipType.BothMembership:
      return 'sos+fablab';
  }
}


export class Membership {
  constructor(public id: number,
              public type: MembershipType,
              public requestedAt: Date,
              public acceptedAt: Date,
              public startsAt: Date,
              public endsAt: Date,
              public deletedAt: Date,
              public userId: number) { }

  public static fromJson(json: any): Membership {
    let type;
    switch (json.type) {
      case 'sos':
        type = MembershipType.OnlySos;
        break;
      case 'fablab':
        type = MembershipType.OnlyFablab;
        break;
      case 'both':
        type = MembershipType.BothMembership;
        break;
      default:
        throw new Error(`Unrecognized membership type ${json.type}`);
    }
    return new Membership(
      json.id, type, new Date(json.requestedAt), json.acceptedAt ? new Date(json.acceptedAt) : null,
      json.startsAt ? new Date(json.startsAt) : null, json.endsAt ? new Date(json.endsAt) : null,
      json.deletedAt ? new Date(json.deletedAt) : null, json.userId)
  }
}


export class UserMemberships {

  constructor(public active: Membership,
              public renewal: Membership,
              public request: Membership) {}

  public static fromJson(json: any): UserMemberships {
    return new UserMemberships(
      json.active ? Membership.fromJson(json.active) : null,
      json.renewal ? Membership.fromJson(json.renewal) : null,
      json.request ? Membership.fromJson(json.request) : null
    )
  }

}


export class UserSkill {
  constructor(public id: number,
              public name: string,
              public skillId: number) {}

  public static fromJson(json: any): UserSkill {
    return new UserSkill(json.id, json.name, json.skillId)
  }
}


export class User {

  constructor(public id: number,
              public firstName: string,
              public lastName: string,
              public email: string,
              public preferredLang: Language,
              public showHelpHome: boolean,
              public showCompleteProfile: boolean,
              public telephone: string | null,
              public bio: string | null,
              public skills: [UserSkill],
              public memberships: UserMemberships) {}

  public get asJson(): {} {
    let json = {};
    for (let p of Object.getOwnPropertyNames(this)) {
      json[p] = this[p];
    }
    json['preferredLang'] = this.preferredLang.code;
    return json;
  }

  public static fromJson(json: any): User {
    return new User(
      json.id, json.firstName, json.lastName, json.email, new Language(json.preferredLang),
      json.showHelpHome, json.showCompleteProfile, json.telephone, json.bio, json.skills.map(UserSkill.fromJson),
      UserMemberships.fromJson(json.memberships))
  }

}
