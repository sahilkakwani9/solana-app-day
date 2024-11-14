export type JOKERACEIDL = {
  version: "0.1.0";
  name: "joke_race_eclipse";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "initContestCounter";
      accounts: [
        {
          name: "contestCounter";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "createContest";
      accounts: [
        {
          name: "contest";
          isMut: true;
          isSigner: false;
        },
        {
          name: "author";
          isMut: true;
          isSigner: true;
        },
        {
          name: "contestCounter";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "metadataUri";
          type: "string";
        },
        {
          name: "startTime";
          type: "i64";
        },
        {
          name: "endTime";
          type: "i64";
        }
      ];
    },
    {
      name: "vote";
      accounts: [
        {
          name: "contest";
          isMut: true;
          isSigner: false;
        },
        {
          name: "voterRecord";
          isMut: true;
          isSigner: false;
        },
        {
          name: "voter";
          isMut: true;
          isSigner: true;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "contestantId";
          type: "u64";
        }
      ];
    },
    {
      name: "distribute";
      accounts: [
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "recipient";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "ContestCounter";
      type: {
        kind: "struct";
        fields: [
          {
            name: "count";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "Contest";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u64";
          },
          {
            name: "metadataUri";
            type: "string";
          },
          {
            name: "upvotes";
            type: "u64";
          },
          {
            name: "author";
            type: "publicKey";
          },
          {
            name: "startTime";
            type: "i64";
          },
          {
            name: "endTime";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "Vault";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "VoterContestRecord";
      type: {
        kind: "struct";
        fields: [
          {
            name: "contestId";
            type: "u64";
          },
          {
            name: "contestantId";
            type: "u64";
          },
          {
            name: "voter";
            type: "publicKey";
          },
          {
            name: "totalVotes";
            type: "u64";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "ContestCreated";
      fields: [
        {
          name: "contestId";
          type: "u64";
          index: false;
        },
        {
          name: "createdBy";
          type: "publicKey";
          index: false;
        },
        {
          name: "metadataUri";
          type: "string";
          index: false;
        },
        {
          name: "createdAt";
          type: "i64";
          index: false;
        },
        {
          name: "startTime";
          type: "i64";
          index: false;
        },
        {
          name: "endTime";
          type: "i64";
          index: false;
        }
      ];
    },
    {
      name: "VoteCasted";
      fields: [
        {
          name: "votedBy";
          type: "publicKey";
          index: false;
        },
        {
          name: "contestId";
          type: "u64";
          index: false;
        },
        {
          name: "castedAt";
          type: "i64";
          index: false;
        },
        {
          name: "contestantId";
          type: "u64";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "AlreadyVoted";
    },
    {
      code: 6001;
      name: "VotingEnded";
    },
    {
      code: 6002;
      name: "Unauthorized";
    },
    {
      code: 6003;
      name: "VotingNotStarted";
    }
  ];
};
export const IDL: JOKERACEIDL = {
  version: "0.1.0",
  name: "joke_race_eclipse",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "initContestCounter",
      accounts: [
        {
          name: "contestCounter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "createContest",
      accounts: [
        {
          name: "contest",
          isMut: true,
          isSigner: false,
        },
        {
          name: "author",
          isMut: true,
          isSigner: true,
        },
        {
          name: "contestCounter",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "metadataUri",
          type: "string",
        },
        {
          name: "startTime",
          type: "i64",
        },
        {
          name: "endTime",
          type: "i64",
        },
      ],
    },
    {
      name: "vote",
      accounts: [
        {
          name: "contest",
          isMut: true,
          isSigner: false,
        },
        {
          name: "voterRecord",
          isMut: true,
          isSigner: false,
        },
        {
          name: "voter",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "contestantId",
          type: "u64",
        },
      ],
    },
    {
      name: "distribute",
      accounts: [
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "recipient",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "ContestCounter",
      type: {
        kind: "struct",
        fields: [
          {
            name: "count",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "Contest",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            type: "u64",
          },
          {
            name: "metadataUri",
            type: "string",
          },
          {
            name: "upvotes",
            type: "u64",
          },
          {
            name: "author",
            type: "publicKey",
          },
          {
            name: "startTime",
            type: "i64",
          },
          {
            name: "endTime",
            type: "i64",
          },
        ],
      },
    },
    {
      name: "Vault",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "VoterContestRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "contestId",
            type: "u64",
          },
          {
            name: "contestantId",
            type: "u64",
          },
          {
            name: "voter",
            type: "publicKey",
          },
          {
            name: "totalVotes",
            type: "u64",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "ContestCreated",
      fields: [
        {
          name: "contestId",
          type: "u64",
          index: false,
        },
        {
          name: "createdBy",
          type: "publicKey",
          index: false,
        },
        {
          name: "metadataUri",
          type: "string",
          index: false,
        },
        {
          name: "createdAt",
          type: "i64",
          index: false,
        },
        {
          name: "startTime",
          type: "i64",
          index: false,
        },
        {
          name: "endTime",
          type: "i64",
          index: false,
        },
      ],
    },
    {
      name: "VoteCasted",
      fields: [
        {
          name: "votedBy",
          type: "publicKey",
          index: false,
        },
        {
          name: "contestId",
          type: "u64",
          index: false,
        },
        {
          name: "castedAt",
          type: "i64",
          index: false,
        },
        {
          name: "contestantId",
          type: "u64",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "AlreadyVoted",
    },
    {
      code: 6001,
      name: "VotingEnded",
    },
    {
      code: 6002,
      name: "Unauthorized",
    },
    {
      code: 6003,
      name: "VotingNotStarted",
    },
  ],
};
