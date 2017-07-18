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
              public skills: UserSkill[],
              public memberships: UserMemberships,
              public profilePic: string | null) {}

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
      UserMemberships.fromJson(json.memberships), json.profilePic)
  }

}


export enum BazaarTeachActivityType {
  LecturePerformance,
  LabsSeminary,
  XYZFormat,
  CulturalEvent,
  VerticalFormat,
  MachineUsage
}


export enum BazaarEventActivityType {
  Talk,
  Projection,
  Exposition,
  Workshop,
  Performance
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
              public topic: string,
              public _delete?: boolean) {}

  public static fromJson(json: any): BazaarIdeaTopic {
    return new BazaarIdeaTopic(json.id, json.topic);
  }

  public get asJson(): any {
    return {
      id: this.id,
      topic: this.topic,
      'delete': this._delete
    };
  }
}


export interface BazaarIdeaMeetingsType {
  asJson: any
}

export class SingleFixedDaysMeetings {
  constructor(public id: number,
              public numberDays: number,
              public numberHours: number,
              public _delete?: boolean) {}

  public static fromJson(json: any): SingleFixedDaysMeetings {
    return new SingleFixedDaysMeetings(json.id, json.numberDays, json.numberHours);
  }

  public get asJson(): any {
    return {
      id: this.id,
      numberDays: this.numberDays,
      numberHours: this.numberHours,
      'delete': this._delete
    }
  }
}

export class FixedDaysMeetings implements BazaarIdeaMeetingsType {
  constructor(public schedules: SingleFixedDaysMeetings[]) {}

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
              public endTime: string,
              public _delete?: boolean) {}

  public static fromJson(json: any): BazaarIdeaDate {
    return new BazaarIdeaDate(json.id, new Date(json.date), json.startTime, json.endTime);
  }

  public get asJson(): any {
    return {
      id: this.id,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      'delete': this._delete
    }
  }
}


export enum BazaarIdeaSOSSpace {
  ConferenceRoom,
  OpenSpace,
  Room,
  SOSFacility,
  SpazioMurat,
  MuseoCivico,
  Biblioteca
}

export class CustomSpace {
  constructor(public space: string) {}
}

export type BazaarIdeaActualSpace = BazaarIdeaSOSSpace | CustomSpace;


export class BazaarIdeaSpace {
  constructor(public id: number,
              public space: BazaarIdeaActualSpace,
              public _delete?: boolean) {}

  public static spaceFromString(space: string): BazaarIdeaActualSpace {
    switch (space) {
      case 'conference_room':
        return BazaarIdeaSOSSpace.ConferenceRoom;
      case 'open_space':
        return BazaarIdeaSOSSpace.OpenSpace;
      case 'room':
        return BazaarIdeaSOSSpace.Room;
      case 'sos_facility':
        return BazaarIdeaSOSSpace.SOSFacility;
      case 'spazio_murat':
        return BazaarIdeaSOSSpace.SpazioMurat;
      case 'museo_civico':
        return BazaarIdeaSOSSpace.MuseoCivico;
      case 'biblioteca':
        return BazaarIdeaSOSSpace.Biblioteca;
      default:
        return new CustomSpace(space);
    }
  }

  public static spaceToString(space: BazaarIdeaActualSpace): string {
    if (space instanceof CustomSpace)
      return space.space;
    switch (space) {
      case BazaarIdeaSOSSpace.ConferenceRoom:
        return 'conference_room';
      case BazaarIdeaSOSSpace.OpenSpace:
        return 'open_space';
      case BazaarIdeaSOSSpace.Room:
        return 'room';
      case BazaarIdeaSOSSpace.SOSFacility:
        return 'sos_facility';
      case BazaarIdeaSOSSpace.SpazioMurat:
        return 'spazio_murat';
      case BazaarIdeaSOSSpace.MuseoCivico:
        return 'museo_civico';
      case BazaarIdeaSOSSpace.Biblioteca:
        return 'biblioteca';
      default:
        throw new Error('unhandled space type');
    }
  }

  public static fromJson(json: any): BazaarIdeaSpace {
    return new BazaarIdeaSpace(json.id, BazaarIdeaSpace.spaceFromString(json.space));
  }

  public get asJson(): any {
    return {
      id: this.id,
      space: BazaarIdeaSpace.spaceToString(this.space),
      'delete': this._delete
    }
  }
}


export class BazaarIdeaGuest {
  constructor(public id: number,
              public userId: number | null,
              public firstName: string,
              public lastName: string,
              public title: string,
              public _delete?: boolean) {}

  public static fromJson(json: any): BazaarIdeaGuest {
    return new BazaarIdeaGuest(json.id, json.userId, json.firstName, json.lastName, json.title);
  }

  public get asJson(): any {
    return {
      id: this.id,
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      title: this.title,
      'delete': this._delete
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


export function teachActivityTypeFromString(str: string): BazaarTeachActivityType {
  switch (str) {
    case "lecture_performance":
      return BazaarTeachActivityType.LecturePerformance;
    case "labs_seminary":
      return BazaarTeachActivityType.LabsSeminary;
    case "xyz_format":
      return BazaarTeachActivityType.XYZFormat;
    case "cultural_event":
      return BazaarTeachActivityType.CulturalEvent;
    case "vertical_format":
      return BazaarTeachActivityType.VerticalFormat;
    case "machine_usage":
      return BazaarTeachActivityType.MachineUsage;
    default:
      throw new Error("unrecognized bazaar idea activity type");
  }
}

export function teachActivityTypeToString(activityType: BazaarTeachActivityType): string {
  switch (activityType) {
    case BazaarTeachActivityType.LecturePerformance:
      return "lecture_performance";
    case BazaarTeachActivityType.LabsSeminary:
      return "labs_seminary";
    case BazaarTeachActivityType.XYZFormat:
      return "xyz_format";
    case BazaarTeachActivityType.CulturalEvent:
      return "cultural_event";
    case BazaarTeachActivityType.VerticalFormat:
      return "vertical_format";
    case BazaarTeachActivityType.MachineUsage:
      return "machine_usage";
  }
}


export function eventActivityTypeFromString(str: string): BazaarEventActivityType {
  switch (str) {
    case "talk":
      return BazaarEventActivityType.Talk;
    case "projection":
      return BazaarEventActivityType.Projection;
    case "exposition":
      return BazaarEventActivityType.Exposition;
    case "workshop":
      return BazaarEventActivityType.Workshop;
    case "performance":
      return BazaarEventActivityType.Performance;
  }
}

export function eventActivityTypeToString(activityType: BazaarEventActivityType): string {
  switch (activityType) {
    case BazaarEventActivityType.Talk:
      return "talk";
    case BazaarEventActivityType.Projection:
      return "projection";
    case BazaarEventActivityType.Exposition:
      return "exposition";
    case BazaarEventActivityType.Workshop:
      return "workshop";
    case BazaarEventActivityType.Performance:
      return "performance";
  }
}


export function audienceFromString(str: string): BazaarIdeaAudience {
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

export function audienceToString(audience: BazaarIdeaAudience): string {
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


export function levelFromString(str: string): BazaarIdeaLevel {
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

export function levelToString(level: BazaarIdeaLevel): string {
  switch (level) {
    case BazaarIdeaLevel.EntryLevel:
      return "entry";
    case BazaarIdeaLevel.IntermediateLevel:
      return "intermediate";
    case BazaarIdeaLevel.AdvancedLevel:
      return "advanced";
  }
}


export function fundingFromString(str: string): BazaarIdeaFunding {
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

export function fundingToString(funding: BazaarIdeaFunding): string {
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


export class BazaarComment {
  constructor(public id: number,
              public userId: number,
              public firstName: string,
              public lastName: string,
              public comment: string,
              public createdAt: Date) {}

  public static fromJson(json: any): BazaarComment {
    return new BazaarComment(
      json.id,
      json.userId,
      json.firstName,
      json.lastName,
      json.comment,
      new Date(json.createdAt)
    )
  }

  public get asJson(): any {
    return {
      id: this.id,
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      comment: this.comment,
      createdAt: this.createdAt
    };
  }
}


export class BazaarPreference {
  constructor(public id: number,
              public ideaId: number,
              public userId: number,
              public agree: boolean,
              public wish: BazaarComment,
              public favorite: boolean) {}

  public static fromJson(json: any): BazaarPreference {
    return new BazaarPreference(json.id, json.ideaId, json.userId, json.agree, json.wish, json.favorite);
  }

  public get asJson(): any {
    return {
      id: this.id,
      ideaId: this.ideaId,
      userId: this.userId,
      agree: this.agree,
      wish: this.wish.asJson,
      favorite: this.favorite
    };
  }
}


export abstract class BazaarIdea {
  constructor(public id: number,
              public title: string,
              public creator: User,
              public topics: BazaarIdeaTopic[],
              public valueDetails: string,
              public motivation: string,
              public createdAt: Date,
              public updatedAt: Date,
              public score: number,
              public preference: BazaarPreference) {}

  public abstract get asJson(): any
  public abstract get isRecurring(): boolean | null
}


export class BazaarLearn extends BazaarIdea {
  constructor(id: number,
              title: string,
              creator: User,
              public location: string,
              topics: BazaarIdeaTopic[],
              public teachers: BazaarIdeaGuest[],
              public tutors: BazaarIdeaGuest[],
              valueDetails: string,
              motivation: string,
              public costs: string | null,
              createdAt: Date,
              updatedAt: Date,
              score: number,
              preference?: BazaarPreference) {
    super(
      id,
      title,
      creator,
      topics,
      valueDetails,
      motivation,
      createdAt,
      updatedAt,
      score,
      preference
    );
  }

  public static fromJson(json: any): BazaarLearn {
    return new BazaarLearn(
      json.id,
      json.title,
      User.fromJson(json.creator),
      json.location,
      json.topics.map(BazaarIdeaTopic.fromJson),
      json.teachers.map(BazaarIdeaGuest.fromJson),
      json.tutors.map(BazaarIdeaGuest.fromJson),
      json.valueDetails,
      json.motivation,
      json.costs,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.score,
      json.preference
    )
  }

  public get asJson(): any {
    return {
      id: this.id,
      title: this.title,
      creator: this.creator.asJson,
      location: this.location,
      topics: this.topics.map(t => t.asJson),
      teachers: this.teachers.map(t => t.asJson),
      tutors: this.tutors.map(t => t.asJson),
      valueDetails: this.valueDetails,
      motivation: this.motivation,
      costs: this.costs,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public get isRecurring(): boolean | null {
    return null;
  }
}


export class BazaarTeach extends BazaarIdea {
  constructor(id: number,
              title: string,
              creator: User,
              public location: string,
              public activityType: BazaarTeachActivityType,
              public audience: BazaarIdeaAudience[],
              public level: BazaarIdeaLevel,
              topics: BazaarIdeaTopic[],
              public meetings: BazaarIdeaMeetingsType,
              public dates: BazaarIdeaDate[],
              public requiredResources: string | null,
              public maxParticipants: number,
              public teachers: BazaarIdeaGuest[],
              public tutors: BazaarIdeaGuest[],
              public programDetails: string,
              public meetingDetails: string,
              public outputDetails: string,
              valueDetails: string,
              motivation: string,
              public funding: BazaarIdeaFunding[],
              public costs: string | null,
              createdAt: Date,
              updatedAt: Date,
              score: number,
              preference?: BazaarPreference) {
    super(
      id,
      title,
      creator,
      topics,
      valueDetails,
      motivation,
      createdAt,
      updatedAt,
      score,
      preference
    );
  }

  public get isRecurring(): boolean | null {
    return this.meetings instanceof RecurringMeetings;
  }

  public get totalHours(): number | null {
    if (this.isRecurring)
      return null;
    return (this.meetings as FixedDaysMeetings).schedules.reduce((acc, s) => acc + s.numberHours * s.numberDays, 0);
  }

  public static fromJson(json: any): BazaarTeach {
    return new BazaarTeach(
      json.id,
      json.title,
      User.fromJson(json.creator),
      json.location,
      teachActivityTypeFromString(json.activityType),
      json.audience.map(audienceFromString),
      levelFromString(json.level),
      json.topics.map(BazaarIdeaTopic.fromJson),
      (json.meetings.type === 'fixed_days' ?
          FixedDaysMeetings.fromJson(json.meetings)
          : RecurringMeetings.fromJson(json.meetings)
      ),
      json.dates.map(BazaarIdeaDate.fromJson),
      json.requiredResources,
      json.maxParticipants,
      json.teachers.map(BazaarIdeaGuest.fromJson),
      json.tutors.map(BazaarIdeaGuest.fromJson),
      json.programDetails,
      json.meetingDetails,
      json.outputDetails,
      json.valueDetails,
      json.motivation,
      json.funding.map(fundingFromString),
      json.costs,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.score,
      json.preference
    )
  }

  public get asJson(): any {
    return {
      id: this.id,
      title: this.title,
      creator: this.creator.asJson,
      location: this.location,
      activityType: teachActivityTypeToString(this.activityType),
      audience: this.audience.map(audienceToString),
      level: levelToString(this.level),
      topics: this.topics.map(t => t.asJson),
      meetings: this.meetings.asJson,
      dates: this.dates.map(d => d.asJson),
      requiredResources: this.requiredResources,
      maxParticipants: this.maxParticipants,
      teachers: this.teachers.map(t => t.asJson),
      tutors: this.tutors.map(t => t.asJson),
      programDetails: this.programDetails,
      meetingDetails: this.meetingDetails,
      outputDetails: this.outputDetails,
      valueDetails: this.valueDetails,
      motivation: this.motivation,
      funding: this.funding.map(fundingToString),
      costs: this.costs,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}


export class BazaarEvent extends BazaarIdea {
  constructor(id: number,
              title: string,
              creator: User,
              public activityType: BazaarEventActivityType,
              public audience: BazaarIdeaAudience[],
              topics: BazaarIdeaTopic[],
              public meetings: BazaarIdeaMeetingsType,
              public dates: BazaarIdeaDate[],
              public requiredResources: string | null,
              public requiredSpaces: BazaarIdeaSpace[],
              public maxParticipants: number,
              public programDetails: string,
              valueDetails: string,
              motivation: string,
              public funding: BazaarIdeaFunding[],
              public isOrganizer: boolean,
              public guests: BazaarIdeaGuest[],
              public bookingRequired: boolean,
              createdAt: Date,
              updatedAt: Date,
              score: number,
              preference?: BazaarPreference) {
    super(
      id,
      title,
      creator,
      topics,
      valueDetails,
      motivation,
      createdAt,
      updatedAt,
      score,
      preference
    );
  }

  public get isRecurring(): boolean | null {
    return this.meetings instanceof RecurringMeetings;
  }

  public get totalHours(): number | null {
    if (this.isRecurring)
      return null;
    return (this.meetings as FixedDaysMeetings).schedules.reduce((acc, s) => acc + s.numberHours * s.numberDays, 0);
  }

  public static fromJson(json: any): BazaarEvent {
    return new BazaarEvent(
      json.id,
      json.title,
      User.fromJson(json.creator),
      eventActivityTypeFromString(json.activityType),
      json.audience.map(audienceFromString),
      json.topics.map(BazaarIdeaTopic.fromJson),
      (json.meetings.type === 'fixed_days' ?
          FixedDaysMeetings.fromJson(json.meetings)
          : RecurringMeetings.fromJson(json.meetings)
      ),
      json.dates.map(BazaarIdeaDate.fromJson),
      json.requiredResources,
      json.requiredSpaces.map(BazaarIdeaSpace.fromJson),
      json.maxParticipants,
      json.programDetails,
      json.valueDetails,
      json.motivation,
      json.funding.map(fundingFromString),
      json.isOrganizer,
      json.guests.map(BazaarIdeaGuest.fromJson),
      json.bookingRequired,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.score,
      json.preference
    )
  }

  public get asJson(): any {
    return {
      id: this.id,
      title: this.title,
      creator: this.creator.asJson,
      activityType: eventActivityTypeToString(this.activityType),
      audience: this.audience.map(audienceToString),
      topics: this.topics.map(t => t.asJson),
      meetings: this.meetings.asJson,
      dates: this.dates.map(d => d.asJson),
      requiredResources: this.requiredResources,
      requiredSpaces: this.requiredSpaces.map(s => s.asJson),
      maxParticipants: this.maxParticipants,
      programDetails: this.programDetails,
      valueDetails: this.valueDetails,
      motivation: this.motivation,
      funding: this.funding.map(fundingToString),
      isOrganizer: this.isOrganizer,
      guests: this.guests.map(g => g.asJson),
      bookingRequired: this.bookingRequired,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}


export type BazaarIdeas = { teach: BazaarTeach[], learn: BazaarLearn[], event: BazaarEvent[] }

