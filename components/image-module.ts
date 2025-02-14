/* eslint-disable @typescript-eslint/no-explicit-any */
export const IMAGE_MAP = new Map<string, any>();

const boundaryBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAiCAYAAADVhWD8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbFJREFUeNpiYMAOFID4PRD3M9AG9EPNV0AWZMLjGAEgNqCRYwyg5hPlmAEBjCDirYzK/4///jHcqy5h0GFlZ2BtagdLPuHmZHjb1cqg9fI1XOy6qhLD77pKBs3b96gqZrppO8RF96SU/oMc9E7L6P+fK9f+/1i1FswH4Q/uvv//ffyIIvalsOw/CFBbDOyYPVOngR0y0A4CO+bO1m1gBwy0g8COgVk+0A5igCXgweAgrAl4oByEMwEPhIPwJmB6O4hgAqang4hKwPRyENgxF9V1/w8GB4Eds2/jJrBhA+0geAIGGTLQDkJJwAPtIIwEPJAOYgY5JpmH34Hr1+8Hv7fvfHBCRurBUSH+D/cPHJT49uPHB6Fde0+c1FZ/cIGN5YHKtZsPGH7+BKvDJnbawebBw1evHsg8f/ng/+s3D/6ev/hgq7bag9evX4PF/l67DmbP+f5F4PyL5xwK7z9eYLt+8wZIbJ+k2ANcjS4HIAYF234aNer2Q813GLTNzlHHjDpm1DGjjhlRjsFVVJ+HFtfvofwEKpmdADXvPdT884SqnP9YcAOVHNOAw/zBF00AAQYAcQJKeR8w6ooAAAAASUVORK5CYII=";
const bridgeBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAUCAYAAAAHpoRMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAP9JREFUeNrsVcENwjAMTIABMoJH6AgZoSMwSpnAYoLACEwATAAbwAZlA3CRQVVwSqJCyIOTTm0qJ77aPkUrpa6qEEyJDXFHXBPPxIq4Im44BogL4p7fL8RlYmy3thF57pVp+IPlteV141Vuy0yNjcozUQWhKDG6pAH+tymEGT+PbEMJhm04FlE5+hbzAzrLtRwzli2fZ4RcD6uLYmriKXDogYjEubDP8l7kuJCoOlYMDvwVJLYGBqqL78S4hNKmINRyFxKDQjvgw4YBoX3OF4NCgPmSg43QAeyL8SuSA9KAv8wIZBIDwgwFJzwHcEiMzSym6uf3b239gyvpmf8mwADIPqJX1ba73QAAAABJRU5ErkJggg==";
const culDeSacBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbJJREFUeNrUmDFOwzAUhh24QI4QNjbSqTC13Tq2N8gFoOUEqCdIWg4APUHChJgIGzDlBqQ3yAgbv6U3VFHj2Mmz1T7pKZVqJZ/fe37+bU8Y2u3dfYDHDD6Ch/Bg7+8KXsBf4NnjJi5N3u0ZQjzAI4P35/AVoHKdweeaIEs8XikSJiYnEA2HN/731+db78gA5MkwGk0m0zdBlKpOMABJqT64TAl0pgCJmUEEpTk1qhmASIhE2LEANeShhnLdyMTCri1odaphMCiq9Q4b5ksgncgshBuLlDAUutARjE+12RiZmXBrIxXMlWOYUAUTHBOMa/OPCUacDEzp+Pu5CmbnGKZUwWSOYT4aYaAzCsepytoKeOsI5Lkusg7BJKTybdu6VVxB9PxC/Pzh59QiSIKobLX6DAYm9WXHvIJWpk1vTgKa02T6502CvO10IPeOdyaNU9HJoOi0HdAMJgz9RwIMVCDax1tSgD9dQQAx4Nwox300C6WbDaavSF+y3EKQaE4ZivdCdc5ujQyFl+NA59N1Srcrkb1lfcnUY67R2Xfo8IV2mmjljGkmNgS6bBPrQxdI/wIMALT9fzgkktCeAAAAAElFTkSuQmCC";
const deadEndBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAiCAYAAADVhWD8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAspJREFUeNpiYMAOFID4PRD3M9AG9EPNV0AWZEZXZc3O6ZDCI1Bvzs5h4MzBpaHOyvbz7K+fN4BSP6jgCIE0Hv4Mb06eAgt2TgE3Dm6F3wz/Xz7+++cBSJIRWWWfoNj8AE6eBH4mJhQTzv768WDq5w+BG79/uUCuK/w5eQyyeQXWG7NxoITGx3//GDZ8/7Kg6P2rRHjIAF1cUMwnVMHByIhhkBQziwA3E5PHmm+fJ5LrmCYBkeM27JwK6OIg+wzY2A0+/Pv7ER4Ezhzc+fgMc+HgUgD6LoHMUEkA6cenBtl+gVMd3f8JgXI+oQZyHAPSR8hskP2wkBHgQ0sn9AYg+1mg7AfXuns/iE6aLoBPw/t/fz+QYxFI3ztZVbxqrv389gEeHNd+/1qAT/HFXz8/zPrycQE5jgHpA+nH6xig/fDctO/Ht5MOHFweMswsEugKH/39wwDM1plHf34/QWYs/JBgZnkpy8IawI8lOZz89eNC8tsXiciF3o+lXz+tBGbsn9///1d4/vePALAwYjjx68eGOV8+Rs79+nEHJWkC6JELL/7+2fiT4b/Eh3//NEBm3/rz+wGouMh69zITqARnyDkA8X8g3k+j9Lofar4DsiA4Ab+VUWlASx/y/bLiDH/ERBU633xqkH7+EsWkp5LiDOu8XRlA4kFbd2PYBJIDqQHJYdNbLsKnwPLqNUPh45fx+mzscAcxQh3zHyOrrVrCwGJpzvA5LIbh9/GTKHKsQHFeoPwfoPgnoDy19A5s4YIGRh0z6phRx4w6ZtQxo44ZdQweAGuQH0AWfPfvr8D8+fMM/hw68CHk9esLgmiaXr1+zbBj9WoGwbv3GYywGHrg4EGG908eMRgB1WHTO62z04Dl7j0B/39/LwgxMRNs5A9IS29QRRMuV5+Huvw9lJ9AJbMToOa9h5p/nlDo/8eCG6jkmAYc5g++aAIIMADqkGpn0OYTpwAAAABJRU5ErkJggg==";
const highwayBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAgCAYAAACYTcH3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWpJREFUeNq8V11MW2UYfjhtKWsplDBot1qoFLdhhHZZNNv8AePiX4I/F15gNEav0BtNJFmyhBtJ1CVw4YXROy7ULO5KJdkWB8GZMWU6peAQFxg4ZLQiKz8t/+383u+c73BOaXvOkumbnJy/77zPc973eb/v/QqQxY4de+KF9vb2t0tL3Whrexd3yzo7u7C4uICOjo6Penv7vsp8b83x3WuMSJMZgND+JEL7kohccyLyh9NwPP0gswV27CAj5fgmHAwGMTwcMSbDiLzaHONnIyN/5Jf8Z3uflUxxcXGAHUgkEoYATkdKd85n5I/8kn9TZJhemhT2mJiYMASYmC7CZz0efjYcq/gj/4RjJjJhj8fLL6LRmCHAk0fjPE10NjLhT/EfNiPgkNfr4RexWFR9uL62hsTyEhwOJ6yFNthshVhNJnGuP4X+i4C9KMXvdzmdfGw6lcLKShLFrhL2rkjnT/EfMkMm0NAQ0qWIHC9N30CrvRA3GaGRdBop9sxjtcJytgD+NRciW1sISjHE/1pHSWEhqum9xYIvl5dhrwnqUkX+CccMmaZM8cZvzaPFakHzkaOwH6jD5s0Z/nzXgw8hzcitj43hUZdLdujz8XvbXh9Wf7qMiSs/I7IQR4m7TCdiwsmrGSaqsBCYtqzTCwt4iv0tv2bg6SX52JqZUQ+yFIsCkaB3RJjGvuVwID7/T7byVvFyRSYgBorIUP4lFu4Pb7ObwUH9aHYf2q9E8OplNumxPz5/fkeo06k0Njc3uM6EX8JhKaNUDeUio1aS0MxKMoHooZcxVfd01gr5Vif97FVk/+U01ucGORnhl3DYdVg7E2eWdmNtbVBXhmkm1k23Xx1Q5S7Cxy/uQ8/rDTj+eLXu42cPlPPnn7fcj3rv9tJwuyLII6z1q+A05ptnAiIy2rJW15UiKy68eZATuji1iJZwJd5/poa/eyRQykmMROU0fMNI0XiuJev2hCj8KjiBrGSYmNwyGQ/7IPdkd7L/Bpq7h9n5T35d7y2Wo1JXzogkceLsdbxyalSNFE/T0ozOB/knHMJTcHdEhis7FAqxUG5HRZIk2Bam+fXi2hY+/VF23BL28KhQhMiI1JmxefW73xixqjI5IqlbM+rEJ6cqynG0uDvIZIqXzOFkf/73hC5Vsl6qeBQoQkZmmZ/SkdGKOBcZdRlIJrcnPHLimBxAwYbcIhCJEkao8ZNfcWpoO52kFdKNIPwAE/DIbAISI+JamuKVJEz4z1wWtGQCInSRiL6PKa+sROGV0xyk9bCPpSCB1iM+Xk2ULrIzv8/jYUaGKo0OsgGWQtu1fnX2FSb8K3iBbGSaRJoy+xhy5hrvw72r4xyAqomiQEf9HrmESTskXHpH9hwTeWIyAvfkdzvICP9Op35ZsGqnZUXhWfsYr8+PyS/ew/MJJ9KuiqzaIAELEUvLc3D1dcHjvydvXyPwWU88JGkVTS9zlTVpx+fZDdfXx7kO8gp29iof59/r0Wkls7wFGYEvyASUdlBX1plGvQoBuHtO8CleiFoY3dt/6EZZ7wd8nLaCdjZaUdGCqroRa1Oj2VaTAKqDtYhPX0B89BzW/Yfg2lOB5dk5VMS+h8W+G+XB+0y1oCRgwmWCbtSSUecYbVnnMlrFyysq0X3yOmLRfoyOA4dfkiPX1llpag8lcGTciJwmZTp2izkms6wNe+DHgHfeYGQO3tmGTuAouG7iIQnxKK2gqe2Jds+U795o26LFJR6SqHOv12t6e3I3TOAIXOJBZKrFHJNvtf4vTLN6k1VLYisryu3/NIEntrxSrtXayDzlG3f0PF+qxOpt1bSApspaLc1VC9q6arI+N+1DwSP8S5cG8K8AAwAH2E8yvU1bbQAAAABJRU5ErkJggg==";
const intersectionBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAjpJREFUeNrsl79Lw1AQx69SbbYXwZIOYpz8hegkuki6aKH/kuAv8B9RF0UcxEVdWlysTlUQKw6tFGyo6OsgpGbQu6cpbU3TRE2j4i0veX1JP7m7d997IfBoK6trcRzi9XODSlGMeb2/eXlqaXEh5fbdYfBuBLLkYb1rmC74QfYP8/dhNG32Z8BIkvTtnvG8tWWZQWJ+TlwzvB5UVSjldyGXu+48DOcVyBcKYBhVGBkegpKug4FzgYUpkzkTo2EYkE4fg45AgYVJZjJU0BtZfiHCpDDzW4BCdlrjZNFonzY2NtqwXgrdQDZ7DqXHaPPalGmaaf4eRvoQ7hDSsFetKZfvRWhsMD/MEHQhfxsngOnpKeHFre2dYIteTFEcPfIV1fZsk5MTWJcioKoDtUJp592OwBwcHgmgVhA1GKsxcmvGc+RDoras0pjYCrsFUHSQXkx8uAhO/9flxsWWKRj7+vt2RjvM2vI00r1jzti0io01JZYEI9stKi1IKki9A/jLnSsYtx50zBmCsDwQwcRLJObgJHMKVZQAP80WhnQH60NtW5JXqOL6odRtc4Y0h8SQV7jIk9zV9VuYfLawU/dOhWpvb78GQnBPl09as3zEessilNAz3vA8buMUflTatTZ94ty03CwfDuemFTw3LQfWA1PjRXkWaEMeweQmIaSybyW+7/1MK5tBVWZKUsDIsgyMMVjf2AwGhjSHVx9EfarvBAOBsXbfZyB8S+B2+tNRGP6Fk8L/WftXwLwKMABej9+xKY2VhQAAAABJRU5ErkJggg==";
const miscellanousBase64 =
  "data:image/png;base64,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";
const railroadBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtVJREFUeNrsVs1u00AQHq9/YidxvSFqBVwazlyCuHBAavoEwK3iQniD9glKn6DwBIQL6o3yBKS33upHCFekKGlD5Dj+Y8ZsyjbEVZvUpUIZ6dNsPjszn3d2dxZgAdMLJkdsk5e4l4R54mmwmNUQ+4h1EoXeFXwHcQi3YZi4hviI6CGSDJwgmteJq8wppoeOX/H1ncAfvc+zTB+oNIjvEvcG0Z7BubexZj7hF7el2drI4K5sDO6QzTszDu0i/PK+xNUzuNzFbM/gOhnJG2It3VqZOrhWHqF/u0iQmxLDxam78S/WzF9iEF8WDXKndtN/sbUPRWk6wk+3BlfaWbmfwHXRsbOsIY2/5i3GnRJDv/uSUHmm2nmvmaMZwhoCF8qC54+btxj5a/uXXCeudcFS5l354qpJJXkxoz28EqeyO9duaj6rfpP6iNxPaLyH2JWegcTtTc1YQ4jEQ7Akc3IMmM7VOu5uqsRubb1+lzCj4StFDvZDCNQyj4prkBTXOI0TZx18KNToWaSv8EB3gLiAWbWJj817EJfuQxqD1zI5ihuZVR5qNk/KD2CS8/HT55XJzGwkJud+oIBmOtyPVNANiyeMAY1NY6XmjwJghs1jFkAUhaAg5yFXRB+ECSgKA8O00hiq4FRVA6bp55w/jtK46cJOPLBM+zwnaVBuqEy7U2W6jMss07I3LcUsxSzF5G2KaAcJ+V6vB5VKBQaDAViWBQxPYBo7jgOnp6dg2zaEYQhBEECpVIJutwvVahU8z0vfLRQK5zGGwyHoug6apqX/leOS0X8o3uR9uVFuGj9O9lfDcZ0Fhlsh7xlpxzVwrITlVtX/2WQ+cnFYj+MYlFG5teqdNdXuSkujZygGz36XYihxueVInCG4CnEirilyTHKO157spGIODj63sR20Gd1NxuBOvKgjjvtH6QXqN9dPa4ucStzg7Ei69bkX3p/FXYj7Jxdp+CXAAGm2PnIIwA7zAAAAAElFTkSuQmCC";
const schoolBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAdCAYAAAAgqdWEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZ5JREFUeNrsVoFxREAU5SYF0IEOKEEqkRJcBahACUYFKQEVoAI6CBW4fcbffEsyIcmRzL2ZP3ff2v1vdv97Vtd+Bq6St1McgkGJcM8iF+0fIjwLEV/EmwjnaCIO65NShHEUERRulMZ9PYpMtqKi4Yj+QcHBsqyhaZoByLJsMAyDCL3ci4hLu5AkiSQC+L5PZHY19B6fmfVF27aa2JG1frpL/8j+cBxHHlNZlvyYKDZBZwWOhn6qz4EkI5pQE7s9RhiGi5z+I1zX/bzDxTh/n8/Hump+yg/lg8xHePrOZOHAY8Bnuq7Tqqoaf3fLiaQtPEOaFxkZz1GUgKIYE94yMzwQMU1zfIb1uDHSfLyD4DnWAxe5M57nyQXSNNVs257lGCdcr9cZWWm7IoeSUCAIAvmcz0fhuq5n+UTm/ZhQmCRbFMUi53Jesf9VUgR1ft/3q/bwUNPfkjaaDGcL5Hk+KoDn6rWBq0sFxqMokjmfjzEEz7m03ekKue0mLho8juPFcyiN1LERz/p0RfQ2XMK33ODA6qsumF42EPlteDcBBgBgeg0qe83N7AAAAABJRU5ErkJggg==";
const speedZoneBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAyZJREFUeNrNV0tME1EUPYXSICVhI6UrwURWahAQvyDqBqWEnwujBogE1BAlIiC1trSF0gp+AaXgL/jHAtIgBTQhWKwEARF1IVsMAmUBIcEFbVPsG21pkxanUNSTTCbnzpmceXfuu+89BuwgEQlbhj9/STKajAx4ECwfFsLDwlqLpdIka4xpLyCmytpaBpfL9aQv5ubmkJ6Wlmgf87InZKSeNiXw9/eHwWiAS+O/Caaz4PexMShv3cTWqCgkpx5Cq7oFve90CAriIudMLl51tFOcQKYoR3vbSxvfvmMnBvrfI+7AQcTu2+/S2OmI6+/fQ3RMDDZu2kzxwYF+FAmEWBsYCN3bHorv2h2NgvN8MJlMB/5x6AMK+QL0aLX4NDzsnnFBER8mkwlioYC6E5SVSDCl11s+aM+vejAa4eW1+Lo9Z7EsVRwRgakpvXupVr9oRn9fH/z8/GwxqUwONptt4z3aN+jV6SCvuOzAfdf4gl+YT33EleuV7hkfPnKUuqwoKVM4PP8Tp4N/VtVLGpNqnp+fd+DNjSpMjI9T/MmjBw66UomYSvPd27UrMybVai0uKyfXnTolXnd2oLury0EnkkhhNBiRdeLU6qVa1fAMkVHbPNtA7EGmEZmrF4sltlj68UwMDQ5Cr9evjvFS1RsSst5p/Gpl1f9d1S5HfDIrk+rJpHFkWFJL0Pi8AYXnzlLt8amqyS0d7RGXyhVgW5aziktyqvXNzMxAISux/G8fW7dyR0fbmMMJgkAowg/LIi4SXEC5XIbp6Wnk5uU5/F+6OreK61haBppUKiqVBBtCQ5FzOnfZOreKS2GXLrI0kqm1Eh1t487foyDQdnevWEfL+NvoKGqqqxDI4WBdcDAeP6x3urjT1dE2Jg3fYDBAJJaizLLFodKYnwez2bwsHS1j6z6L7DgSk1MQE7sXSSmpGBn5ijpljds6Wsazs7OQikXUFkZevlg0YmkpAgICUH3jGiYnJ2jrnMHhxMDjxS+0tWlWpUUmJPCg0bQz/q8diLe3tyU1kx43IUcYcn5y2bl48TxNdnZ23MKCmelJY2IaGb5F06JW22I/Afb1nRcMukVoAAAAAElFTkSuQmCC";
const tunnelBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAIAAACRuyQOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXxJREFUeNpi7I6zZqALYLn78iOdbFIW5x/106ifBpufvv/6c/XxuyuP3v74/Re/KRyszMoS/CbKYpxsLLjUMGa462CVeP/l5+Hrz569+0q8q4HW+JkqCvKwk+AnoG82nb5PkjVwXZVBxlh9hj2eztx5Rao1cMsWHrjhqi9LlJ+A4Xbm7iuyY/7ui49AmzCNxeKnw9eeUZjMdl98zKBPyE9A7997+YlCm4DeCrdSRUsa6H669+IT0DLKcw8w3WrLCeHzEzAtUCWfPnv/FZji8fkJmFWpYhMwAIFGcbAxY/cTMGVTJejgANlwFD9dffSOitYAizGcfqJWJEHz5defOP1E3XIdGBfIBqL4CVg6UNEmYJRLCXLDy0CEn378+kv1OglYqkkJcaP7iRZVItBDcPMRfqJuwoPnKniZhLATWA7RyU9P332hvp9efoSbj7ATVNTTx0/ULYfgZmLxE55mDSWZl05+Qs48CD+R10QhvjineRsWi59oBODmAwQYAN9F4lYnjYLhAAAAAElFTkSuQmCC";

export const initializeImageMap = () => {
  const map = IMAGE_MAP;
  map.set("INTERSECTION", intersectionBase64);
  map.set("MISCELLANEOUS", miscellanousBase64);
  map.set("BRIDGE", bridgeBase64);
  map.set("BRIDGE_OVER_HIGHWAY", bridgeBase64);
  map.set("BRIDGE_OVER_RAILROAD", bridgeBase64);
  map.set("ONE_LANE_BRIDGE", bridgeBase64);
  map.set("ROAD_END", deadEndBase64);
  map.set("HIGHWAY_UNDER_HIGHWAY", highwayBase64);
  map.set("HIGHWAY_UNDER_RAILROAD", highwayBase64);
  map.set("MAINTENANCE_BOUNDARY", boundaryBase64);
  map.set("COUNTY_BOUNDARY", boundaryBase64);
  map.set("TOWNSHIP_BOUNDARY", boundaryBase64);
  map.set("STATE_BOUNDARY", boundaryBase64);
  map.set("CORPORATION_LIMIT", boundaryBase64);
  map.set("RAILROAD", railroadBase64);
  map.set("CUL_DE_SAC", culDeSacBase64);
  map.set("SCHOOL_ZONE", schoolBase64);
  map.set("TUNNEL", tunnelBase64);
  map.set("ONE_LANE_TUNNEL", tunnelBase64);
  map.set("SPEED_ZONE", speedZoneBase64);
  return map;
};
export const cpImages = {
  INTERSECTION: {
    key: "INTERSECTION",
    type: "Intersection",
    image: () => IMAGE_MAP.get("INTERSECTION"),
  },
  MISCELLANEOUS: {
    key: "MISCELLANEOUS",
    type: "Miscellaneous",
    image: () => IMAGE_MAP.get("MISCELLANEOUS"),
  },
  BRIDGE: {
    key: "BRIDGE",
    type: "Bridge",
    image: () => IMAGE_MAP.get("BRIDGE"),
  },
  BRIDGE_OVER_HIGHWAY: {
    key: "BRIDGE_OVER_HIGHWAY",
    type: "Bridge (Hwy Over Hwy)",
    image: () => IMAGE_MAP.get("BRIDGE_OVER_HIGHWAY"),
  },
  BRIDGE_OVER_RAILROAD: {
    key: "BRIDGE_OVER_RAILROAD",
    type: "Bridge (Hwy Over Railroad)",
    image: () => IMAGE_MAP.get("BRIDGE_OVER_RAILROAD"),
  },
  ONE_LANE_BRIDGE: {
    key: "ONE_LANE_BRIDGE",
    type: "1-lane Bridge",
    image: () => IMAGE_MAP.get("ONE_LANE_BRIDGE"),
  },
  ROAD_END: {
    key: "ROAD_END",
    type: "Road End",
    image: () => IMAGE_MAP.get("ROAD_END"),
  },
  HIGHWAY_UNDER_HIGHWAY: {
    key: "HIGHWAY_UNDER_HIGHWAY",
    type: "Hwy Under Hwy",
    image: () => IMAGE_MAP.get("HIGHWAY_UNDER_HIGHWAY"),
  },
  HIGHWAY_UNDER_RAILROAD: {
    key: "HIGHWAY_UNDER_RAILROAD",
    type: "Hwy Under Railroad",
    image: () => IMAGE_MAP.get("HIGHWAY_UNDER_RAILROAD"),
  },
  MAINTENANCE_BOUNDARY: {
    key: "MAINTENANCE_BOUNDARY",
    type: "MAINTENANCE BOUNDARY",
    image: () => IMAGE_MAP.get("MAINTENANCE_BOUNDARY"),
  },
  COUNTY_BOUNDARY: {
    key: "COUNTY_BOUNDARY",
    type: "County Boundary",
    image: () => IMAGE_MAP.get("COUNTY_BOUNDARY"),
  },
  TOWNSHIP_BOUNDARY: {
    key: "TOWNSHIP_BOUNDARY",
    type: "Township Boundary",
    image: () => IMAGE_MAP.get("TOWNSHIP_BOUNDARY"),
  },
  STATE_BOUNDARY: {
    key: "STATE_BOUNDARY",
    type: "State Boundary",
    image: () => IMAGE_MAP.get("STATE_BOUNDARY"),
  },
  CORPORATION_LIMIT: {
    key: "CORPORATION_LIMIT",
    type: "Corporation Limit",
    image: () => IMAGE_MAP.get("CORPORATION_LIMIT"),
  },
  RAILROAD: {
    key: "RAILROAD",
    type: "Railroad",
    image: () => IMAGE_MAP.get("RAILROAD"),
  },
  CUL_DE_SAC: {
    key: "CUL_DE_SAC",
    type: "Cul De Sac",
    image: () => IMAGE_MAP.get("CUL_DE_SAC"),
  },
  SCHOOL_ZONE: {
    key: "SCHOOL_ZONE",
    type: "School Zone",
    image: () => IMAGE_MAP.get("SCHOOL_ZONE"),
  },
  TUNNEL: {
    key: "TUNNEL",
    type: "Tunnel",
    image: () => IMAGE_MAP.get("TUNNEL"),
  },
  ONE_LANE_TUNNEL: {
    key: "ONE_LANE_TUNNEL",
    type: "1-lane Tunnel",
    image: () => IMAGE_MAP.get("ONE_LANE_TUNNEL"),
  },
  SPEED_ZONE: {
    key: "SPEED_ZONE",
    type: "Speed Zone",
    image: () => IMAGE_MAP.get("SPEED_ZONE"),
  },
};

export const getCPImageByType = (type: string, proposedSignage = false) => {
  if (proposedSignage && type === cpImages.SPEED_ZONE.type)
    return cpImages.SPEED_ZONE.image();

  switch (type) {
    case cpImages.INTERSECTION.type:
      return cpImages.INTERSECTION.image();

    case cpImages.MISCELLANEOUS.type:
      return cpImages.MISCELLANEOUS.image();

    case cpImages.BRIDGE.type:
      return cpImages.BRIDGE.image();

    case cpImages.BRIDGE_OVER_HIGHWAY.type:
      return cpImages.BRIDGE_OVER_HIGHWAY.image();

    case cpImages.BRIDGE_OVER_RAILROAD.type:
      return cpImages.BRIDGE_OVER_RAILROAD.image();

    case cpImages.ONE_LANE_BRIDGE.type:
      return cpImages.ONE_LANE_BRIDGE.image();

    case cpImages.ROAD_END.type:
      return cpImages.ROAD_END.image();

    case cpImages.HIGHWAY_UNDER_HIGHWAY.type:
      return cpImages.HIGHWAY_UNDER_HIGHWAY.image();

    case cpImages.HIGHWAY_UNDER_RAILROAD.type:
      return cpImages.HIGHWAY_UNDER_RAILROAD.image();

    case cpImages.MAINTENANCE_BOUNDARY.type:
      return cpImages.MAINTENANCE_BOUNDARY.image();

    case cpImages.COUNTY_BOUNDARY.type:
      return cpImages.COUNTY_BOUNDARY.image();

    case cpImages.TOWNSHIP_BOUNDARY.type:
      return cpImages.TOWNSHIP_BOUNDARY.image();

    case cpImages.STATE_BOUNDARY.type:
      return cpImages.STATE_BOUNDARY.image();

    case cpImages.CORPORATION_LIMIT.type:
      return cpImages.CORPORATION_LIMIT.image();

    case cpImages.RAILROAD.type:
      return cpImages.RAILROAD.image();

    case cpImages.CUL_DE_SAC.type:
      return cpImages.CUL_DE_SAC.image();

    case cpImages.SCHOOL_ZONE.type:
      return cpImages.SCHOOL_ZONE.image();

    case cpImages.TUNNEL.type:
      return cpImages.TUNNEL.image();

    case cpImages.ONE_LANE_TUNNEL.type:
      return cpImages.ONE_LANE_TUNNEL.image();

    case cpImages.SPEED_ZONE.type:
      return cpImages.SPEED_ZONE.image();

    default:
      return null;
  }
};

export const imageCache: Record<string, HTMLImageElement> = {};
export const preloadImages = (types: string[]) => {
  if (typeof window !== "undefined" && typeof Image !== "undefined") {
    types.forEach((type) => {
      const img = new Image();
      img.src = getCPImageByType(type);
      img.onload = () => {
        // console.log(`Image preloaded: ${type}`);
      };
      imageCache[type] = img;
    });
  } else {
    //  console.warn(
    //     "Image preloading skipped: Not running in a browser environment."
    //   );
  }
};
export const controlImages = [
  "County Boundary",
  "MAINTENANCE BOUNDARY",
  "Township Boundary",
  "Corporation Limit",
  "State Boundary",
  "Bridge (Hwy Over Railroad)",
  "Bridge",
  "1-lane Bridge",
  "Bridge (Hwy Over Hwy)",
  "Cul De Sac",
  "Road End",
  "Hwy Under Railroad",
  "Hwy Under Hwy",
  "Intersection",
  "Miscellaneous",
  "Railroad",
  "School Zone",
  "Speed Zone",
  "1-lane Tunnel",
  "Tunnel",
];
