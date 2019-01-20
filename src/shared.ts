import {UserShort} from "./";


export class Environment {
  constructor(public production: boolean,
              public backendUrl: string,
              public rulesUrl: string) { }
}


export class Language {
  constructor(public code: string) {}
}


export class Skill {

  constructor(public id: number,
              public name: string,
              public parentId?: number | null,
              public request?: boolean | null,
              public path?: Skill[] | null,
              public _delete?: boolean) {}

  public static fromJson(json: any): Skill {
    return new Skill(json.id, json.name, json.parentId, json.request,
      json.path ? json.path.map(Skill.fromJson) : null)
  }

  public get asJson(): any {
    return {
      id: this.id,
      name: this.name,
      parentId: this.parentId,
      request: this.request,
      'delete': this._delete
    };
  }

}

export interface SkillSlim {
  id: number
  name: string
}


export interface MembershipType {
  id: number
  language: string
  name: string
  offer: string
  bottom: string
  price: number
  position: number
  createdAt: Date
}

export namespace MembershipType {
  export function fromJson(json: any): MembershipType {
    return {
      id: json.id,
      language: json.language,
      name: json.name,
      offer: json.offer,
      bottom: json.bottom,
      price: json.price,
      position: json.position,
      createdAt: new Date(json.createdAt)
    }
  }
}

export interface MembershipTypeSlim {
  id: number,
  name?: string
}

export namespace MembershipTypeSlim {
  export function fromJson(json: any): MembershipTypeSlim {
    return {
      id: json.id,
      name: json.name
    }
  }
}


export interface Membership {
  id: number
  membershipType: MembershipTypeSlim
  requestedAt: Date
  acceptedAt?: Date
  startsAt?: Date
  endsAt?: Date
  userId: number
}

export namespace Membership {
  export function fromJson(json: any): Membership {
    return {
      id: json.id,
      membershipType: MembershipTypeSlim.fromJson(json.membershipType),
      requestedAt: new Date(json.requestedAt),
      acceptedAt: json.acceptedAt ? new Date(json.acceptedAt) : null,
      startsAt: json.startsAt ? new Date(json.startsAt) : null,
      endsAt: json.endsAt ? new Date(json.endsAt) : null,
      userId: json.userId
    }
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
              public skillId: number,
              public request?: boolean | null) {}

  public static fromJson(json: any): UserSkill {
    return new UserSkill(json.id, json.name, json.skillId, json.request)
  }

  public get asJson(): any {
    return {
      id: this.id,
      name: this.name,
      skillId: this.skillId,
      request: this.request
    }
  }
}


export class User {

  constructor(public id: number,
              public firstName: string,
              public lastName: string,
              public email: string,
              public preferredLang: Language,
              public telephone: string | null,
              public bio: string | null,
              public skills: UserSkill[],
              public memberships: UserMemberships,
              public title: string | null,
              public city: {city:string, other:boolean} | null,
              public favorite: boolean | null) {}

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
      json.telephone, json.bio, json.skills.map(UserSkill.fromJson),
      UserMemberships.fromJson(json.memberships), json.title, json.city, json.favorite)
  }

}

export interface UserShort {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface UserContacts {
  id: number
  email: string
  telephone: string
  firstName: string
  lastName: string
}


export enum TeachActivityType {
  LecturePerformance,
  LabsSeminary,
  XYZFormat,
  CulturalEvent,
  VerticalFormat,
  MachineUsage
}


export enum EventActivityType {
  Talk,
  Projection,
  Exposition,
  Workshop,
  Performance
}


export enum Audience {
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


export enum Level {
  EntryLevel,
  IntermediateLevel,
  AdvancedLevel
}


export class Topic {
  constructor(public id: number,
              public topic: string,
              public _delete?: boolean) {}

  public static fromJson(json: any): Topic {
    return new Topic(json.id, json.topic);
  }

  public get asJson(): any {
    return {
      id: this.id,
      topic: this.topic,
      'delete': this._delete
    };
  }
}


export class SOSDate {
  constructor(public id: number,
              public date: Date,
              public startTime: string,
              public endTime: string,
              public _delete?: boolean) {}

  public static fromJson(json: any): SOSDate {
    return new SOSDate(json.id, new Date(json.date), json.startTime, json.endTime);
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


export enum BazaarIdeaFramework {
  TeachingFramework,
  ResearchFramework,
  EntertainmentFramework
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


export function teachActivityTypeFromString(str: string): TeachActivityType {
  switch (str) {
    case "lecture_performance":
      return TeachActivityType.LecturePerformance;
    case "labs_seminary":
      return TeachActivityType.LabsSeminary;
    case "xyz_format":
      return TeachActivityType.XYZFormat;
    case "cultural_event":
      return TeachActivityType.CulturalEvent;
    case "vertical_format":
      return TeachActivityType.VerticalFormat;
    case "machine_usage":
      return TeachActivityType.MachineUsage;
    default:
      throw new Error("unrecognized bazaar idea activity type");
  }
}

export function teachActivityTypeToString(activityType: TeachActivityType): string {
  switch (activityType) {
    case TeachActivityType.LecturePerformance:
      return "lecture_performance";
    case TeachActivityType.LabsSeminary:
      return "labs_seminary";
    case TeachActivityType.XYZFormat:
      return "xyz_format";
    case TeachActivityType.CulturalEvent:
      return "cultural_event";
    case TeachActivityType.VerticalFormat:
      return "vertical_format";
    case TeachActivityType.MachineUsage:
      return "machine_usage";
  }
}


export function eventActivityTypeFromString(str: string): EventActivityType {
  switch (str) {
    case "talk":
      return EventActivityType.Talk;
    case "projection":
      return EventActivityType.Projection;
    case "exposition":
      return EventActivityType.Exposition;
    case "workshop":
      return EventActivityType.Workshop;
    case "performance":
      return EventActivityType.Performance;
  }
}

export function eventActivityTypeToString(activityType: EventActivityType): string {
  switch (activityType) {
    case EventActivityType.Talk:
      return "talk";
    case EventActivityType.Projection:
      return "projection";
    case EventActivityType.Exposition:
      return "exposition";
    case EventActivityType.Workshop:
      return "workshop";
    case EventActivityType.Performance:
      return "performance";
  }
}


export function audienceFromString(str: string): Audience {
  switch (str) {
    case "kids":
      return Audience.Kids;
    case "teenagers":
      return Audience.Teenagers;
    case "students":
      return Audience.Students;
    case "researchers":
      return Audience.Researchers;
    case "professionals":
      return Audience.Professionals;
    case "companies":
      return Audience.Companies;
    case "public_administrations":
      return Audience.PublicAdministrations;
    case "seniors":
      return Audience.Seniors;
    case "immigrants":
      return Audience.Immigrants;
    case "unemployed":
      return Audience.Unemployed;
    default:
      throw new Error("unrecognized bazaar idea audience type");
  }
}

export function audienceToString(audience: Audience): string {
  switch (audience) {
    case Audience.Kids:
      return "kids";
    case Audience.Teenagers:
      return "teenagers";
    case Audience.Students:
      return "students";
    case Audience.Researchers:
      return "researchers";
    case Audience.Professionals:
      return "professionals";
    case Audience.Companies:
      return "companies";
    case Audience.PublicAdministrations:
      return "public_administrations";
    case Audience.Seniors:
      return "seniors";
    case Audience.Immigrants:
      return "immigrants";
    case Audience.Unemployed:
      return "unemployed";
  }
}


export function levelFromString(str: string): Level {
  switch (str) {
    case "entry":
      return Level.EntryLevel;
    case "intermediate":
      return Level.IntermediateLevel;
    case "advanced":
      return Level.AdvancedLevel;
    default:
      throw new Error("unrecognized bazaar idea level type");
  }
}

export function levelToString(level: Level): string {
  switch (level) {
    case Level.EntryLevel:
      return "entry";
    case Level.IntermediateLevel:
      return "intermediate";
    case Level.AdvancedLevel:
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

export interface BazaarPreferenceSlim {
  id: number
  agree: boolean
  wish: boolean
  favorite: boolean
  viewed: boolean
}

export interface BazaarPreferenceCounts {
  views: number,
  agrees: number,
  wishes: number,
  comments: number,
  favorites: number
}


export interface BazaarIdeaSlim {
  id: number
  title: string
  creator: UserShort
  topics: Topic[]
  preference: BazaarPreferenceSlim,
  counts: BazaarPreferenceCounts,
  createdAt: Date
  updatedAt: Date
  ideaType: IdeaType
  score: number
  deadline: number | null
  activityId?: number
  skills: { id: number, name: string }[]
}

export namespace BazaarIdeaSlim {
  export function fromJson(json: any): BazaarIdeaSlim {
    return {
      id: json.id,
      title: json.title,
      creator: json.creator,
      topics: json.topics,
      preference: json.preference,
      counts: json.counts,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
      ideaType: json.ideaType,
      score: json.score,
      deadline: json.deadline,
      activityId: json.activityId,
      skills: json.skills
    }
  }
}

export abstract class BazaarIdea {
  constructor(public id: number,
              public title: string,
              public creator: User,
              public topics: Topic[],
              public valueDetails: string,
              public motivation: string,
              public createdAt: Date,
              public updatedAt: Date,
              public score: number,
              public preference: BazaarPreference,
              public counts: BazaarPreferenceCounts,
              public ideaType: IdeaType,
              public activityId: number | null) {}

  public abstract get asJson(): any
  public abstract get isRecurring(): boolean | null
}


export class BazaarLearn extends BazaarIdea {
  constructor(id: number,
              title: string,
              creator: User,
              public location: string,
              topics: Topic[],
              public teachers: BazaarIdeaGuest[],
              public tutors: BazaarIdeaGuest[],
              valueDetails: string,
              motivation: string,
              public costs: string | null,
              createdAt: Date,
              updatedAt: Date,
              score: number,
              preference?: BazaarPreference,
              counts?: BazaarPreferenceCounts,
              ideaType?: IdeaType,
              activityId?: number | null) {
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
      preference,
      counts,
      ideaType,
      activityId
    );
  }

  public static fromJson(json: any): BazaarLearn {
    return new BazaarLearn(
      json.id,
      json.title,
      User.fromJson(json.creator),
      json.location,
      json.topics.map(Topic.fromJson),
      json.teachers.map(BazaarIdeaGuest.fromJson),
      json.tutors.map(BazaarIdeaGuest.fromJson),
      json.valueDetails,
      json.motivation,
      json.costs,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.score,
      json.preference,
      json.counts,
      json.type,
      json.activityId
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
      updatedAt: this.updatedAt,
      type: this.ideaType
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
              public activityType: TeachActivityType,
              public audience: Audience[],
              public level: Level,
              topics: Topic[],
              public meetings: BazaarIdeaMeetingsType,
              public dates: SOSDate[],
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
              preference?: BazaarPreference,
              counts?: BazaarPreferenceCounts,
              ideaType?: IdeaType,
              activityId?: number | null) {
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
      preference,
      counts,
      ideaType,
      activityId
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
      json.topics.map(Topic.fromJson),
      (json.meetings.type === 'fixed_days' ?
          FixedDaysMeetings.fromJson(json.meetings)
          : RecurringMeetings.fromJson(json.meetings)
      ),
      json.dates.map(SOSDate.fromJson),
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
      json.preference,
      json.counts,
      json.type,
      json.activityId
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
      updatedAt: this.updatedAt,
      type: this.ideaType
    };
  }
}


export class BazaarEvent extends BazaarIdea {
  constructor(id: number,
              title: string,
              creator: User,
              public activityType: EventActivityType,
              public audience: Audience[],
              topics: Topic[],
              public meetings: BazaarIdeaMeetingsType,
              public dates: SOSDate[],
              public requiredResources: string | null,
              public requiredSpaces: string | null,
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
              preference?: BazaarPreference,
              counts?: BazaarPreferenceCounts,
              ideaType?: IdeaType,
              activityId?: number | null) {
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
      preference,
      counts,
      ideaType,
      activityId
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
      json.topics.map(Topic.fromJson),
      (json.meetings.type === 'fixed_days' ?
          FixedDaysMeetings.fromJson(json.meetings)
          : RecurringMeetings.fromJson(json.meetings)
      ),
      json.dates.map(SOSDate.fromJson),
      json.requiredResources,
      json.requiredSpaces,
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
      json.preference,
      json.counts,
      json.type,
      json.activityId
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
      requiredSpaces: this.requiredSpaces,
      maxParticipants: this.maxParticipants,
      programDetails: this.programDetails,
      valueDetails: this.valueDetails,
      motivation: this.motivation,
      funding: this.funding.map(fundingToString),
      isOrganizer: this.isOrganizer,
      guests: this.guests.map(g => g.asJson),
      bookingRequired: this.bookingRequired,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      type: this.ideaType
    };
  }
}


export class BazaarResearchRole {
  constructor(public id: number,
              public people: number,
              public skills: Skill[],
              public _delete: boolean = false) {}

  public get asJson(): any {
    return {
      id: this.id,
      people: this.people,
      skills: this.skills.map(s => s.asJson),
      'delete': this._delete
    };
  }

  public static fromJson(json: any): BazaarResearchRole {
    return new BazaarResearchRole(json.id, json.people, json.skills.map(Skill.fromJson))
  }
}

export class BazaarResearch extends BazaarIdea {
  constructor(id: number,
              title: string,
              creator: User,
              topics: Topic[],
              public organizationName: string | null,
              valueDetails: string,
              motivation: string,
              public requiredResources: string,
              public positions: BazaarResearchRole[],
              public deadline: number,
              public duration: number,
              createdAt: Date,
              updatedAt: Date,
              score: number,
              preference?: BazaarPreference,
              counts?: BazaarPreferenceCounts,
              ideaType?: IdeaType,
              activityId?: number | null) {
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
      preference,
      counts,
      ideaType,
      activityId
    );
  }

  public static fromJson(json: any): BazaarResearch {
    return new BazaarResearch(
      json.id,
      json.title,
      User.fromJson(json.creator),
      json.topics.map(Topic.fromJson),
      json.organizationName,
      json.valueDetails,
      json.motivation,
      json.requiredResources,
      json.positions.map(BazaarResearchRole.fromJson),
      json.deadline,
      json.duration,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.score,
      json.preference,
      json.counts,
      json.type,
      json.activityId
    )
  }

  public get asJson(): any {
    return {
      id: this.id,
      title: this.title,
      creator: this.creator.asJson,
      topics: this.topics.map(t => t.asJson),
      organizationName: this.organizationName,
      valueDetails: this.valueDetails,
      motivation: this.motivation,
      requiredResources: this.requiredResources,
      positions: this.positions.map(p => p.asJson),
      deadline: this.deadline,
      duration: this.duration,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      type: this.ideaType
    };
  }

  public get isRecurring(): boolean | null {
    return null;
  }
}


export type BazaarIdeas = { teach: BazaarTeach[], learn: BazaarLearn[], event: BazaarEvent[], research: BazaarResearch[] }

export type IdeaType = 'learn' | 'teach' | 'event' | 'research';

