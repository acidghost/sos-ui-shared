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


export enum BazaarIdeaActivityType {
  LecturePerformance,
  LabsSeminary,
  XYZFormat,
  CulturalEvent,
  VerticalFormat,
  MachineUsage
}


export enum BazaarIdeaFramework {
  TeachingFramework,
  ResearchFramework,
  EntertainmentFramework
}


export enum BazaarIdeaAudience {
  Kids,
  Teenagers,
  Students,
  Researchers,
  Professionals,
  Companies,
  PublicAdministrations,
  Seniors,
  Immigrants,
  Unemployed
}


export enum BazaarIdeaLevel {
  EntryLevel,
  IntermediateLevel,
  AdvancedLevel
}


export class BazaarIdeaTopic {
  constructor(public id: number,
              public topic: string) {}

  public static fromJson(json: any): BazaarIdeaTopic {
    return new BazaarIdeaTopic(json.id, json.topic);
  }

  public get asJson(): any {
    return {
      id: this.id,
      topic: this.topic
    };
  }
}


export interface BazaarIdeaMeetingsType {
  asJson: any
}

export class SingleFixedDaysMeetings {
  constructor(public id: number,
              public numberDays: number,
              public numberHours: number) {}

  public static fromJson(json: any): SingleFixedDaysMeetings {
    return new SingleFixedDaysMeetings(json.id, json.numberDays, json.numberHours);
  }

  public get asJson(): any {
    return {
      id: this.id,
      numberDays: this.numberDays,
      numberHours: this.numberHours
    }
  }
}

export class FixedDaysMeetings implements BazaarIdeaMeetingsType {
  constructor(public schedules: [SingleFixedDaysMeetings]) {}

  public static fromJson(json: any): FixedDaysMeetings {
    return new FixedDaysMeetings(json.schedules.map(SingleFixedDaysMeetings.fromJson))
  }

  public get asJson(): any {
    return {
      type: 'fixed_days',
      schedules: this.schedules.map(s => s.asJson)
    }
  }
}

export enum RecurringEntity {
  Weekly,
  Monthly,
  Yearly
}

export class RecurringMeetings implements BazaarIdeaMeetingsType {
  constructor(public days: number,
              public every: number,
              public entity: RecurringEntity,
              public hours: number) {}

  public static recurringEntityFromString(str: string): RecurringEntity {
    switch (str) {
      case "weekly": return RecurringEntity.Weekly;
      case "monthly": return RecurringEntity.Monthly;
      case "yearly": return RecurringEntity.Yearly;
      default: throw new Error('unrecognized recurring entity');
    }
  }

  public static recurringEntityToString(recurringEntity: RecurringEntity): string {
    switch (recurringEntity) {
      case RecurringEntity.Weekly: return "weekly";
      case RecurringEntity.Monthly: return "monthly";
      case RecurringEntity.Yearly: return "yearly";
    }
  }

  public static fromJson(json: any): RecurringMeetings {
    return new RecurringMeetings(
      json.days, json.every, RecurringMeetings.recurringEntityFromString(json.entity), json.hours);
  }

  public get asJson(): any {
    return {
      type: 'recurring',
      days: this.days,
      every: this.every,
      entity: RecurringMeetings.recurringEntityToString(this.entity),
      hours: this.hours
    }
  }
}


export class BazaarIdeaDate {
  constructor(public id: number,
              public date: Date,
              public startTime: string,
              public endTime: string) {}

  public static fromJson(json: any): BazaarIdeaDate {
    return new BazaarIdeaDate(json.id, new Date(json.date), json.startTime, json.endTime);
  }

  public get asJson(): any {
    return {
      id: this.id,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime
    }
  }
}


export class BazaarIdeaSpace {
  constructor(public id: number,
              public space: string) {}

  public static fromJson(json: any): BazaarIdeaSpace {
    return new BazaarIdeaSpace(json.id, json.space);
  }

  public get asJson(): any {
    return {
      id: this.id,
      space: this.space
    }
  }
}


export class BazaarIdeaTeacher {
  constructor(public id: number,
              public userId: number | null,
              public firstName: string,
              public lastName: string,
              public title: string) {}

  public static fromJson(json: any): BazaarIdeaTeacher {
    return new BazaarIdeaTeacher(json.id, json.userId, json.firstName, json.lastName, json.title);
  }

  public get asJson(): any {
    return {
      id: this.id,
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      title: this.title
    }
  }
}


export enum BazaarIdeaFunding {
  TuitionFee,
  Sponsor,
  Grant,
  Crowdfunding,
  SelfFinanced
}


export class BazaarIdea {

  constructor(public id: number,
              public title: string,
              public creator: User,
              public location: string,
              public activityType: BazaarIdeaActivityType,
              public frameworks: [BazaarIdeaFramework],
              public audience: [BazaarIdeaAudience],
              public level: BazaarIdeaLevel,
              public topics: [BazaarIdeaTopic],
              public meetings: BazaarIdeaMeetingsType,
              public dates: [BazaarIdeaDate],
              public requiredResources: string | null,
              public requiredSpaces: [BazaarIdeaSpace],
              public maxParticipants: number,
              public teachers: [BazaarIdeaTeacher],
              public tutors: [BazaarIdeaTeacher],
              public programDetails: string,
              public meetingDetails: string,
              public outputDetails: string,
              public valueDetails: string,
              public motivation: string,
              public funding: [BazaarIdeaFunding],
              public costs: string | null,
              public createdAt: Date,
              public updatedAt: Date,
              public score: number) {}

  public static activityTypeFromString(str: string): BazaarIdeaActivityType {
    switch (str) {
      case "lecture_performance":
        return BazaarIdeaActivityType.LecturePerformance;
      case "labs_seminary":
        return BazaarIdeaActivityType.LabsSeminary;
      case "xyz_format":
        return BazaarIdeaActivityType.XYZFormat;
      case "cultural_event":
        return BazaarIdeaActivityType.CulturalEvent;
      case "vertical_format":
        return BazaarIdeaActivityType.VerticalFormat;
      case "machine_usage":
        return BazaarIdeaActivityType.MachineUsage;
      default:
        throw new Error("unrecognized bazaar idea activity type");
    }
  }

  public static activityTypeToString(activityType: BazaarIdeaActivityType): string {
    switch (activityType) {
      case BazaarIdeaActivityType.LecturePerformance:
        return "lecture_performance";
      case BazaarIdeaActivityType.LabsSeminary:
        return "labs_seminary";
      case BazaarIdeaActivityType.XYZFormat:
        return "xyz_format";
      case BazaarIdeaActivityType.CulturalEvent:
        return "cultural_event";
      case BazaarIdeaActivityType.VerticalFormat:
        return "vertical_format";
      case BazaarIdeaActivityType.MachineUsage:
        return "machine_usage";
    }
  }

  public static frameworkFromString(str: string): BazaarIdeaFramework {
    switch (str) {
      case "teaching":
        return BazaarIdeaFramework.TeachingFramework;
      case "research":
        return BazaarIdeaFramework.ResearchFramework;
      case "entertainment":
        return BazaarIdeaFramework.EntertainmentFramework;
      default:
        throw new Error("unrecognized bazaar idea framework type");
    }
  }

  public static frameworkToString(framework: BazaarIdeaFramework): string {
    switch (framework) {
      case BazaarIdeaFramework.TeachingFramework:
        return "teaching";
      case BazaarIdeaFramework.ResearchFramework:
        return "research";
      case BazaarIdeaFramework.EntertainmentFramework:
        return "entertainment";
    }
  }

  public static audienceFromString(str: string): BazaarIdeaAudience {
    switch (str) {
      case "kids":
        return BazaarIdeaAudience.Kids;
      case "teenagers":
        return BazaarIdeaAudience.Teenagers;
      case "students":
        return BazaarIdeaAudience.Students;
      case "researchers":
        return BazaarIdeaAudience.Researchers;
      case "professionals":
        return BazaarIdeaAudience.Professionals;
      case "companies":
        return BazaarIdeaAudience.Companies;
      case "public_administrations":
        return BazaarIdeaAudience.PublicAdministrations;
      case "seniors":
        return BazaarIdeaAudience.Seniors;
      case "immigrants":
        return BazaarIdeaAudience.Immigrants;
      case "unemployed":
        return BazaarIdeaAudience.Unemployed;
      default:
        throw new Error("unrecognized bazaar idea audience type");
    }
  }

  public static audienceToString(audience: BazaarIdeaAudience): string {
    switch (audience) {
      case BazaarIdeaAudience.Kids:
        return "kids";
      case BazaarIdeaAudience.Teenagers:
        return "teenagers";
      case BazaarIdeaAudience.Students:
        return "students";
      case BazaarIdeaAudience.Researchers:
        return "researchers";
      case BazaarIdeaAudience.Professionals:
        return "professionals";
      case BazaarIdeaAudience.Companies:
        return "companies";
      case BazaarIdeaAudience.PublicAdministrations:
        return "public_administrations";
      case BazaarIdeaAudience.Seniors:
        return "seniors";
      case BazaarIdeaAudience.Immigrants:
        return "immigrants";
      case BazaarIdeaAudience.Unemployed:
        return "unemployed";
    }
  }

  public static levelFromString(str: string): BazaarIdeaLevel {
    switch (str) {
      case "entry":
        return BazaarIdeaLevel.EntryLevel;
      case "intermediate":
        return BazaarIdeaLevel.IntermediateLevel;
      case "advanced":
        return BazaarIdeaLevel.AdvancedLevel;
      default:
        throw new Error("unrecognized bazaar idea level type");
    }
  }

  public static levelToString(level: BazaarIdeaLevel): string {
    switch (level) {
      case BazaarIdeaLevel.EntryLevel:
        return "entry";
      case BazaarIdeaLevel.IntermediateLevel:
        return "intermediate";
      case BazaarIdeaLevel.AdvancedLevel:
        return "advanced";
    }
  }

  public static fundingFromString(str: string): BazaarIdeaFunding {
    switch (str) {
      case "tuition_fee":
        return BazaarIdeaFunding.TuitionFee;
      case "sponsor":
        return BazaarIdeaFunding.Sponsor;
      case "grant":
        return BazaarIdeaFunding.Grant;
      case "crowdfunding":
        return BazaarIdeaFunding.Crowdfunding;
      case "self_financed":
        return BazaarIdeaFunding.SelfFinanced;
      default:
        throw new Error("unrecognized bazaar idea funding type");
    }
  }

  public static fundingToString(funding: BazaarIdeaFunding): string {
    switch (funding) {
      case BazaarIdeaFunding.TuitionFee:
        return "tuition_fee";
      case BazaarIdeaFunding.Sponsor:
        return "sponsor";
      case BazaarIdeaFunding.Grant:
        return "grant";
      case BazaarIdeaFunding.Crowdfunding:
        return "crowdfunding";
      case BazaarIdeaFunding.SelfFinanced:
        return "self_financed";
    }
  }

  public static fromJson(json: any): BazaarIdea {
    return new BazaarIdea(
      json.id, json.title, User.fromJson(json.creator), json.location,
      BazaarIdea.activityTypeFromString(json.activityType),
      json.frameworks.map(BazaarIdea.frameworkFromString),
      json.audience.map(BazaarIdea.audienceFromString),
      BazaarIdea.levelFromString(json.level),
      json.topics.map(BazaarIdeaTopic.fromJson),
      (json.meetings.type === 'fixed_days' ?
        FixedDaysMeetings.fromJson(json.meetings)
      : RecurringMeetings.fromJson(json.meetings)
      ),
      json.dates.map(BazaarIdeaDate.fromJson),
      json.requiredResources,
      json.requiredSpaces.map(BazaarIdeaSpace.fromJson),
      json.maxParticipants,
      json.teachers.map(BazaarIdeaTeacher.fromJson),
      json.tutors.map(BazaarIdeaTeacher.fromJson),
      json.programDetails,
      json.meetingDetails,
      json.outputDetails,
      json.valueDetails,
      json.motivation,
      json.funding.map(BazaarIdea.fundingFromString),
      json.costs,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.score
    );
  }

  public get asJson(): any {
    return {
      id: this.id,
      title: this.title,
      creator: this.creator.asJson,
      location: this.location,
      activityType: BazaarIdea.activityTypeToString(this.activityType),
      frameworks: this.frameworks.map(BazaarIdea.frameworkToString),
      audience: this.audience.map(BazaarIdea.audienceToString),
      level: BazaarIdea.levelToString(this.level),
      topics: this.topics.map(t => t.asJson),
      meetings: this.meetings.asJson,
      dates: this.dates.map(d => d.asJson),
      requiredResources: this.requiredResources,
      requiredSpaces: this.requiredSpaces.map(s => s.asJson),
      maxParticipants: this.maxParticipants,
      teachers: this.teachers.map(t => t.asJson),
      tutors: this.tutors.map(t => t.asJson),
      programDetails: this.programDetails,
      meetingDetails: this.meetingDetails,
      outputDetails: this.outputDetails,
      valueDetails: this.valueDetails,
      motivation: this.motivation,
      funding: this.funding.map(BazaarIdea.fundingToString),
      costs: this.costs,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  public get isRecurring(): boolean {
    return this.meetings instanceof RecurringMeetings;
  }

  public get totalHours(): number | null {
    if (this.isRecurring)
      return null;
    return (this.meetings as FixedDaysMeetings).schedules.reduce((acc, s) => acc + s.numberHours * s.numberDays, 0);
  }

}
