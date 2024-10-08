import { deepEqual } from "node:assert";
import { ok, equal } from "node:assert/strict";
import { test } from "node:test";

const numIsValidInteger = (num: unknown): num is number => {
  return typeof num === 'number' && Number.isInteger(num) && num >= 0;
};

const isValidString = (name: string): name is string => {
  return typeof name === 'string' && name.length > 0;
};

type Room = {
  isFull: () => boolean;
  addZombie: (zombie: string) => void;
  zombiesInRoom: () => string[];
  numberOfZombies: () => number;
  spaceLeft: () => number; 
};

const createRoom = (capacity: number) => {
  if (!numIsValidInteger(capacity)) return `Error: Parameter 'capacity' must be a positive integer`;
  
  const _capacity = capacity; 
  let _zombiesInRoom: string[] = [];

  return {
    isFull: () => _capacity === _zombiesInRoom.length,
    addZombie: (zombie: string) => {
      if (!isValidString(zombie)) 
        return `Error: Wrong format. No zombie was added to the room since you tried to add "${zombie}".`;  
      
      if (_capacity === _zombiesInRoom.length) {
        _zombiesInRoom.shift();
      }
        
      _zombiesInRoom.push(zombie);
    },
    zombiesInRoom: () => _zombiesInRoom,
    numberOfZombies: () => _zombiesInRoom.length, 
    spaceLeft: () => capacity - _zombiesInRoom.length,
  };
};

test("room is full", () => {
  const room = createRoom(0) as Room;

  const result = room.isFull();  

  ok(result);
});

test("empty room that fits one zombie is not full", () => {
  const room = createRoom(1) as Room;

  const result = room.isFull();

  ok(!result);
});

test("empty room cannot fit any zombies", () => {
  const room = createRoom(0) as Room;

  const result = room.isFull();

  ok(result);
});

test("one-roomer becomes full when a zombie is added", () => {
  const room = createRoom(1) as Room;

  room.addZombie('Ugh Lee');

  const result = room.isFull();  

  ok(result);
});

test("two-roomer is not full when a zombie is added", () => {
  const room = createRoom(2) as Room;

  room.addZombie('Ugh Lee');

  const result = room.isFull();  

  ok(!result);
});

test("second zombie consumes first zombie when added to a one-roomer", () => {
  const room = createRoom(1) as Room;

  room.addZombie('Ugh Lee');
  room.addZombie('Bloody Mary');

  const zombieInRoom = room.zombiesInRoom();
  
  deepEqual(zombieInRoom, ['Bloody Mary']);
});

test("three-roomer has one space left when two zombies are added", () => {
  const room = createRoom(3) as Room;

  room.addZombie('Ugh Lee');
  room.addZombie('Bloody Mary');

  const spaceLeft = room.spaceLeft();

  equal(spaceLeft, 1);
});

test("argument is of wrong type", () => {
  const result = createRoom(1.23);
  
  equal(result, `Error: Parameter 'capacity' must be a positive integer`);
});

test("zombie is in wrong format", () => {
  const room = createRoom(1) as Room;

  const result = room.addZombie('');
  
  equal(result, `Error: Wrong format. No zombie was added to the room since you tried to add "".`);
});
